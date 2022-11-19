#!/bin/bash

docker build -t monolith .

docker run \
  -v "$HOME/.config/gcloud:/gcp/config:ro" \
  -v /gcp/config/logs \
  --env CLOUDSDK_CONFIG=/gcp/config \
  --env GOOGLE_APPLICATION_CREDENTIALS=/gcp/config/application_default_credentials.json \
  -p 8080:8080 \
  monolith
