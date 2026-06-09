import { createReadStream } from "fs";
import { stat } from "fs/promises";
import Database from "better-sqlite3";
import { Upload } from "@aws-sdk/lib-storage";
import { DB_PATH, getR2Config, runScript } from "./setupR2.js";

async function main() {
  const { client, bucket, objectKey } = getR2Config();

  // Step 1: checkpoint the WAL so the DB file is fully self-contained
  console.log("Running WAL checkpoint...");
  const db = new Database(DB_PATH);
  db.pragma("wal_checkpoint(TRUNCATE)");
  db.close();
  console.log("WAL checkpoint complete.");

  // Step 2: upload to R2
  const { size } = await stat(DB_PATH);
  console.log(`Uploading ${DB_PATH} (${(size / 1024 / 1024).toFixed(1)} MB) to r2://${bucket}/${objectKey}`);

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: objectKey,
      Body: createReadStream(DB_PATH),
      ContentType: "application/octet-stream",
      ContentLength: size,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
    if (progress.loaded && progress.total) {
      const pct = ((progress.loaded / progress.total) * 100).toFixed(1);
      process.stdout.write(`\r  ${pct}% (${(progress.loaded / 1024 / 1024).toFixed(1)} / ${(progress.total / 1024 / 1024).toFixed(1)} MB)`);
    }
  });

  await upload.done();
  process.stdout.write("\n");
  console.log("Upload complete.");
}

runScript(main);
