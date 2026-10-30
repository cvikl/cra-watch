"""Settings from the environment (.env is loaded if present). Nothing here is secret-aware beyond reading keys."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(os.environ.get("CRAWATCH_ENV_FILE", ".env"))

ROOT = Path(__file__).resolve().parent.parent


def _env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


@dataclass
class Settings:
    nebius_api_key: str = field(default_factory=lambda: _env("NEBIUS_API_KEY"))
    nebius_base_url: str = field(default_factory=lambda: _env("NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1/"))
    # Tiered Nemotron: the small, fast model classifies; the large model drafts the legal notification.
    nemotron_nano: str = field(default_factory=lambda: _env("NEMOTRON_NANO", "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B"))
    nemotron_ultra: str = field(default_factory=lambda: _env("NEMOTRON_ULTRA", "nvidia/Nemotron-3-Ultra-550b-a55b"))
    tavily_api_key: str = field(default_factory=lambda: _env("TAVILY_API_KEY"))
    data_dir: Path = field(default_factory=lambda: Path(_env("CRAWATCH_DATA", str(ROOT / "data"))))
    repo_dir: Path = field(default_factory=lambda: Path(_env("CRAWATCH_REPO", str(ROOT / "data" / "payments-api"))))
    demo_bundle: Path = field(default_factory=lambda: Path(_env("CRAWATCH_DEMO_BUNDLE", str(ROOT / "demo" / "payments-api.bundle"))))
    product_name: str = field(default_factory=lambda: _env("CRAWATCH_PRODUCT", "acme-payments/payments-api"))
    manufacturer: str = field(default_factory=lambda: _env("CRAWATCH_MANUFACTURER", "Acme Payments B.V."))
    public_base_url: str = field(default_factory=lambda: _env("CRAWATCH_PUBLIC_URL", ""))
    fake_llm: bool = field(default_factory=lambda: _env("CRAWATCH_FAKE_LLM") == "1")
    review_token: str = field(default_factory=lambda: _env("CRAWATCH_TOKEN"))
    monitor_interval_s: int = field(default_factory=lambda: int(_env("CRAWATCH_MONITOR_INTERVAL", "300")))
    # Vendor bulletin feed for the demo dependency (a public URL Tavily can read; the synthetic advisory in demo/advisories)
    demo_bulletin: str = field(default_factory=lambda: _env("CRAWATCH_DEMO_BULLETIN", "https://raw.githubusercontent.com/cvikl/cra-watch/main/demo/advisories/GHSA-demo-f4st-pay0-2100.md"))
    demo_dependency: str = field(default_factory=lambda: _env("CRAWATCH_DEMO_DEPENDENCY", "fast-pay-utils"))

    @property
    def nebius_ready(self) -> bool:
        return bool(self.nebius_api_key) or self.fake_llm

    @property
    def tavily_ready(self) -> bool:
        return bool(self.tavily_api_key)


settings = Settings()
