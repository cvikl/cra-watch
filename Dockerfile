# CRA Watch: review UI (Nebius Serverless Endpoint) and monitor (Nebius Serverless Job) share one image.
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pyproject.toml README.md LICENSE pytest.ini ./
COPY vendor/origit ./vendor/origit
COPY crawatch ./crawatch
COPY demo ./demo
RUN pip install --no-cache-dir ./vendor/origit && pip install --no-cache-dir .
ENV CRAWATCH_DATA=/data CRAWATCH_REPO=/data/payments-api PORT=8000
EXPOSE 8000
# Endpoint: `cra-watch serve`; Job: `cra-watch monitor --loop`
CMD ["sh", "-c", "cra-watch serve --port ${PORT}"]
