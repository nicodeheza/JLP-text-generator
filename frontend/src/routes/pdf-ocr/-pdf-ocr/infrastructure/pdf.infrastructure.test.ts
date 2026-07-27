import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'

interface BinaryDataFactoryInstance {
  fetch: (args: {
    kind: 'wasmUrl' | 'cMapUrl' | 'standardFontDataUrl'
    filename: string
  }) => Promise<Uint8Array>
}

type BinaryDataFactoryClass = new () => BinaryDataFactoryInstance

interface GetDocumentOptions {
  data: ArrayBuffer
  useWorkerFetch?: boolean
  BinaryDataFactory?: BinaryDataFactoryClass
}

const { getDocumentMock } = vi.hoisted(() => ({
  getDocumentMock: vi.fn() as Mock<(options: GetDocumentOptions) => unknown>,
}))

vi.mock('pdfjs-dist', () => ({
  getDocument: getDocumentMock,
  GlobalWorkerOptions: { workerSrc: '' },
}))

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'pdfjs-worker-stub',
}))

import { pdf } from './pdf.infrastructure'

describe('pdf.infrastructure', () => {
  beforeEach(() => {
    getDocumentMock.mockReset()
    getDocumentMock.mockReturnValue({
      promise: Promise.resolve({
        numPages: 1,
        destroy: vi.fn().mockResolvedValue(undefined),
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadPdf', () => {
    it('should pass useWorkerFetch: false so the worker routes asset fetches through the main thread', async () => {
      await pdf.loadPdf(new File(['pdf-bytes'], 'test.pdf', { type: 'application/pdf' }))

      expect(getDocumentMock).toHaveBeenCalledTimes(1)
      expect(getDocumentMock.mock.calls[0]?.[0]?.useWorkerFetch).toBe(false)
    })

    it('should pass a BinaryDataFactory class (not an instance) so pdf.js can construct it', async () => {
      await pdf.loadPdf(new File(['pdf-bytes'], 'test.pdf', { type: 'application/pdf' }))

      const Factory = getDocumentMock.mock.calls[0]?.[0]?.BinaryDataFactory
      expect(Factory).toBeDefined()
      expect(typeof Factory).toBe('function')
      // Class methods live on the prototype, not on the class itself.
      const instance = new Factory!()
      expect(typeof instance.fetch).toBe('function')
    })

    it('should resolve successfully for a valid file', async () => {
      const file = new File(['pdf-bytes'], 'test.pdf', { type: 'application/pdf' })
      await expect(pdf.loadPdf(file)).resolves.toBeUndefined()
    })
  })

  describe('BinaryDataFactory', () => {
    let factory: BinaryDataFactoryInstance

    beforeEach(async () => {
      await pdf.loadPdf(new File(['pdf-bytes'], 'test.pdf', { type: 'application/pdf' }))
      const Factory = getDocumentMock.mock.calls[0]?.[0]?.BinaryDataFactory
      if (!Factory) throw new Error('BinaryDataFactory not passed to getDocument')
      factory = new Factory()
    })

    it('should fetch the resolved URL and return its bytes for a known WASM file', async () => {
      const fakeBytes = new Uint8Array([1, 2, 3, 4])
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(fakeBytes, { status: 200 }))

      const result = await factory.fetch({ kind: 'wasmUrl', filename: 'jbig2.wasm' })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const url = fetchSpy.mock.calls[0]?.[0]
      expect(typeof url).toBe('string')
      expect(result).toEqual(fakeBytes)
    })

    it('should fetch the resolved URL for a known CMap file', async () => {
      const fakeBytes = new Uint8Array([9, 8, 7])
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(fakeBytes, { status: 200 }))

      const result = await factory.fetch({
        kind: 'cMapUrl',
        filename: '78-EUC-H.bcmap',
      })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(fakeBytes)
    })

    it('should throw a descriptive error for an unknown asset', async () => {
      await expect(
        factory.fetch({ kind: 'wasmUrl', filename: 'does-not-exist.wasm' })
      ).rejects.toThrow(/Unknown pdfjs asset: wasmUrl\/does-not-exist\.wasm/)
    })

    it('should propagate a non-OK response as a fetch error', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('not found', { status: 404, statusText: 'Not Found' })
      )

      await expect(factory.fetch({ kind: 'wasmUrl', filename: 'jbig2.wasm' })).rejects.toThrow(
        /Failed to fetch .+: Not Found/
      )
    })
  })
})
