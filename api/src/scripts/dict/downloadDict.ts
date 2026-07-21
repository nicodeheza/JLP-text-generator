import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { DB_DIR, DB_PATH, getR2Config, runScript } from './setupR2.js'

async function main() {
  const { client, bucket, objectKey } = getR2Config()

  await mkdir(DB_DIR, { recursive: true })

  console.log(`Downloading r2://${bucket}/${objectKey} -> ${DB_PATH}`)

  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objectKey }))

  if (!response.Body) {
    throw new Error('Empty response body from R2')
  }

  const totalBytes = response.ContentLength
  let downloaded = 0

  const body = response.Body as Readable

  body.on('data', (chunk: Buffer) => {
    downloaded += chunk.length
    if (totalBytes) {
      const pct = ((downloaded / totalBytes) * 100).toFixed(1)
      process.stdout.write(
        `\r  ${pct}% (${(downloaded / 1024 / 1024).toFixed(1)} / ${(totalBytes / 1024 / 1024).toFixed(1)} MB)`
      )
    }
  })

  await pipeline(body, createWriteStream(DB_PATH))
  process.stdout.write('\n')
  console.log('Download complete.')
}

runScript(main)
