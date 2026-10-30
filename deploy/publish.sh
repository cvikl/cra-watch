#!/usr/bin/env bash
# Publish CRA Watch to the shared Hetzner box -> https://cra-watch.vantapointlabs.com
#   SERVER=root@host bash deploy/publish.sh
# Conventions: app in /opt/cra-watch, container on the existing Caddy network, Caddy drop-in in /opt/caddy-sites,
# zero-downtime `caddy reload`. Touches nothing else on the box. Needs ./.env with NEBIUS_API_KEY, TAVILY_API_KEY, CRAWATCH_TOKEN.
set -euo pipefail
HOST=${SERVER:?set SERVER=user@host}
APP_DIR=/opt/cra-watch
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$ROOT/.env" ] || { echo "missing $ROOT/.env"; exit 1; }
grep -q '^CRAWATCH_TOKEN=.\+' "$ROOT/.env" || { echo "CRAWATCH_TOKEN must be set in .env (mutating API calls on a public host need it)"; exit 1; }

echo "==> rsync sources to $HOST:$APP_DIR"
ssh "$HOST" "mkdir -p $APP_DIR /opt/caddy-sites"
rsync -az --delete --exclude .venv --exclude data --exclude data-fixture --exclude __pycache__ --exclude .pytest_cache \
  --exclude '*.egg-info' --exclude .git --exclude .impeccable "$ROOT/" "$HOST:$APP_DIR/"
rsync -az "$ROOT/.env" "$HOST:$APP_DIR/deploy/.env"

echo "==> build + start"
ssh "$HOST" "cd $APP_DIR/deploy && docker compose build cra-watch && docker compose up -d cra-watch"

echo "==> caddy drop-in + reload"
rsync -az "$ROOT/deploy/cra-watch.caddy" "$HOST:/opt/caddy-sites/cra-watch.caddy"
ssh "$HOST" "cd /opt/compass/deploy && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile"

echo "==> health"
sleep 4
ssh "$HOST" "docker exec cra-watch python -c 'import urllib.request;print(urllib.request.urlopen(\"http://127.0.0.1:8000/healthz\").read().decode())'"
curl -sS -o /dev/null -w "https://cra-watch.vantapointlabs.com  HTTP %{http_code}\n" --max-time 30 https://cra-watch.vantapointlabs.com/ || echo "  (needs the cra-watch A record; the first HTTPS hit may lag while the certificate is issued)"
