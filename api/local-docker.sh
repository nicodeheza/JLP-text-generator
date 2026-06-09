#!/bin/bash
set -a
ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR" || exit 1
source $ROOT_DIR/api/.env

IMAGE_NAME=ja-tools-api
PORT=4000

build() {
  docker build -f api/Dockerfile . \
    --secret id=r2_endpoint_url,env=R2_ENDPOINT_URL \
    --secret id=r2_access_key_id,env=R2_ACCESS_KEY_ID \
    --secret id=r2_secret_access_key,env=R2_SECRET_ACCESS_KEY \
    -t "$IMAGE_NAME"
}

run() {
  docker run -p "$PORT:$PORT" --env-file api/.env "$IMAGE_NAME"
}

case "$1" in
  build) build ;;
  run)   run ;;
  *)     echo "Usage: $0 {build|run}" ;;
esac