import * as pdfjsLib from 'pdfjs-dist'
import { type PDFDocumentProxy } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

type AssetKind = 'wasmUrl' | 'cMapUrl' | 'standardFontDataUrl'

const wasmUrlMap: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob('/node_modules/pdfjs-dist/wasm/*.{wasm,js}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>
  ).map(([path, url]) => [path.split('/').pop()!, url])
)

const cMapUrlMap: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob('/node_modules/pdfjs-dist/cmaps/*.bcmap', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>
  ).map(([path, url]) => [path.split('/').pop()!, url])
)

class PdfjsBinaryDataFactory {
  async fetch({ kind, filename }: { kind: AssetKind; filename: string }): Promise<Uint8Array> {
    const tables: Record<AssetKind, Record<string, string>> = {
      wasmUrl: wasmUrlMap,
      cMapUrl: cMapUrlMap,
      standardFontDataUrl: {},
    }
    const url = tables[kind]?.[filename]
    if (!url) throw new Error(`Unknown pdfjs asset: ${kind}/${filename}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    return new Uint8Array(await response.arrayBuffer())
  }
}

export interface IPdf {
  renderPage: (canvas: HTMLCanvasElement, page: number) => Promise<void>
  totalPages: number
  name: string
  loadPdf: (file: File) => Promise<void>
}
class Pdf implements IPdf {
  private document: PDFDocumentProxy | undefined
  private _totalPages = 0
  private _name = ''

  public async loadPdf(file: File): Promise<void> {
    if (this.document) {
      await this.document.destroy()
      this.document = undefined
      this._totalPages = 0
      this._name = ''
    }

    return new Promise<void>((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result
          if (!arrayBuffer) throw new Error('Failed to load PDF document')

          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            useWorkerFetch: false,
            BinaryDataFactory: PdfjsBinaryDataFactory,
          })
          const pdfDoc = await loadingTask.promise

          this.document = pdfDoc
          this._totalPages = pdfDoc.numPages
          this._name = file.name

          resolve()
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Failed to load PDF document'))
        }
      }

      fileReader.onerror = () => {
        reject(new Error('Failed to read PDF file'))
      }

      fileReader.readAsArrayBuffer(file)
    })
  }

  public async renderPage(canvas: HTMLCanvasElement, pageNumber: number): Promise<void> {
    if (!this.document) {
      throw new Error('No PDF document loaded')
    }

    const validPage = Math.max(1, Math.min(pageNumber, this._totalPages))
    const page = await this.document.getPage(validPage)
    const viewport = page.getViewport({ scale: 5.0 })

    canvas.width = viewport.width
    canvas.height = viewport.height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to get canvas context')
    }

    const renderTask = page.render({
      canvasContext: context,
      canvas,
      viewport,
    })

    await renderTask.promise
  }

  get totalPages() {
    return this._totalPages
  }

  get name() {
    return this._name
  }
}

export const pdf = new Pdf()
