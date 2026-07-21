import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { S3Client } from '@aws-sdk/client-s3'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const DB_DIR = resolve(__dirname, '../../../jmDict')
export const DB_PATH = resolve(DB_DIR, 'dictDb.db')

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function getR2Config(): {
  client: S3Client
  bucket: string
  objectKey: string
} {
  const endpointUrl = getRequiredEnv('R2_ENDPOINT_URL')
  const accessKeyId = getRequiredEnv('R2_ACCESS_KEY_ID')
  const secretAccessKey = getRequiredEnv('R2_SECRET_ACCESS_KEY')

  const parsed = new URL(endpointUrl)
  const bucket = parsed.pathname.replace(/^\//, '')
  const endpoint = parsed.origin

  if (!bucket)
    throw new Error(
      'R2_ENDPOINT_URL must include the bucket name as the path (e.g. https://<id>.r2.cloudflarestorage.com/my-bucket)'
    )

  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })

  return { client, bucket, objectKey: 'dictDb.db' }
}

export function runScript(fn: () => Promise<void>): void {
  fn().catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
