#!/usr/bin/env sh
# Run the CRA Watch monitor as a Nebius Serverless Job. The job polls the advisory feeds for the job's lifetime
# (up to 168 h); re-create it on a schedule from CI to keep it running. Secrets come from Nebius SecretStash.
#   nebius ai job create --name cra-watch-monitor --image "$IMAGE" --platform cpu-e2 --preset 2vcpu-8gb \
#     --timeout 168h --container-command cra-watch --args "monitor --loop" \
#     --env CRAWATCH_MONITOR_INTERVAL=300 --env NEMOTRON_NANO=nvidia/Nemotron-3_5-Lightning \
#     --env NEMOTRON_ULTRA=nvidia/Nemotron-3-Ultra-550b-a55b \
#     --env-secret NEBIUS_API_KEY=cra-watch/nebius-api-key --env-secret TAVILY_API_KEY=cra-watch/tavily-api-key
set -eu
IMAGE="${IMAGE:?set IMAGE to the pushed container image, e.g. cr.eu-north1.nebius.cloud/<registry>/cra-watch:latest}"
nebius ai job create --name cra-watch-monitor --image "$IMAGE" --platform cpu-e2 --preset 2vcpu-8gb \
  --timeout 168h --container-command cra-watch --args "monitor --loop" \
  --env CRAWATCH_MONITOR_INTERVAL="${CRAWATCH_MONITOR_INTERVAL:-300}" \
  --env NEMOTRON_NANO="${NEMOTRON_NANO:-nvidia/Nemotron-3_5-Lightning}" \
  --env NEMOTRON_ULTRA="${NEMOTRON_ULTRA:-nvidia/Nemotron-3-Ultra-550b-a55b}" \
  --env-secret NEBIUS_API_KEY=cra-watch/nebius-api-key --env-secret TAVILY_API_KEY=cra-watch/tavily-api-key
