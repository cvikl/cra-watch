#!/usr/bin/env sh
# Terminal take for the demo video: Sentinel scan, then one monitor poll that finds the advisory and runs the pipeline.
cd "$(dirname "$0")/.." || exit 1
.venv/bin/cra-watch reset >/dev/null
clear
printf '$ cra-watch sentinel\n'
.venv/bin/cra-watch sentinel
printf '\n$ cra-watch monitor\n'
.venv/bin/cra-watch monitor --only fast-pay-utils
