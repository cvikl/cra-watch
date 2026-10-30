/* CRA Watch console on Primer CSS. State comes from /api/state; every server-sent event re-renders. */
(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k)));
    return n;
  };
  const fmtT = (iso) => iso ? iso.replace("T", " ").replace("Z", " UTC") : "–";
  const hhmm = (iso) => iso ? iso.slice(11, 19) : "–";
  const pad = (n) => String(n).padStart(2, "0");
  const dur = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`; };
  const parse = (iso) => Date.parse(iso);
  const incNo = (inc) => inc.id.replace("inc_", "INC-").toUpperCase();
  const ICON = {
    check: '<svg class="octicon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>',
    dot: '<svg class="octicon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/></svg>',
    x: '<svg class="octicon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/></svg>',
    clock: '<svg class="octicon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/></svg>',
  };
  const STEPS = [
    ["detect", "Detect", "Tavily feed"], ["trace", "Trace", "provenance records"], ["read", "Read", "Tavily extract"],
    ["triage", "Triage", "Nemotron Nano"], ["context", "Context", "Tavily search"], ["draft", "Draft", "Nemotron Ultra"], ["review", "Review", "a person"],
  ];
  const ORDER = ["detected", "trace", "read", "triage", "context", "draft", "review", "filed"];

  let state = null, selectedIncident = null, selectedCommit = null, clockTimer = null, watchOpen = false;

  // ------------------------------------------------------------------ data
  async function api(path, opts = {}) {
    const r = await fetch(path, { headers: { "Content-Type": "application/json", "X-CRAWatch-Token": localStorage.getItem("crawatch_token") || "" }, ...opts });
    const body = await r.json().catch(() => ({}));
    if (r.status === 401 && !opts._retried) {
      const t = window.prompt("This console is public. Enter the review token to run actions:");
      if (t) { localStorage.setItem("crawatch_token", t.trim()); return api(path, { ...opts, _retried: true }); }
    }
    if (!r.ok) throw new Error(body.detail || body.error || r.statusText);
    return body;
  }
  async function refresh() { state = await api("/api/state"); render(); }
  let pending = false;
  function scheduleRefresh() { if (pending) return; pending = true; setTimeout(() => { pending = false; refresh().catch(console.error); }, 150); }

  // ------------------------------------------------------------------ render
  const currentIncident = () => state.incidents.length ? (state.incidents.find((i) => i.id === selectedIncident) || state.incidents[0]) : null;
  const sev = (r) => ({ low: "p", medium: "h", high: "d", critical: "d", none: "n" }[r] || "n");
  function render() {
    const inc = currentIncident();
    renderHero(inc);
    $("#report").replaceChildren(...(inc ? renderIncident(inc) : renderEmpty()));
    renderWatchlist(); renderCommits(); renderJournal(); renderLedger();
    startClock(inc);
  }
  function demoButton(cls) {
    const d = state.demo || {}, running = !!state.jobs.demo;
    if (running) return el("span", { class: "s p" }, "demo running");
    return el("button", { class: cls, type: "button", disabled: !d.available || !d.can_start, title: d.reason || "Sentinel, detection, trace, triage and draft run with real calls while you watch. About a minute.", onclick: (e) => act(e.target, "/api/demo/run") }, "Run the live demo");
  }
  function renderHero(inc) {
    const product = $("#app").dataset.product, c = state.config, running = !!state.jobs.demo, last = state.events[state.events.length - 1];
    $("#eyebrow").textContent = `${product} · Nebius Token Factory · Nemotron Nano + Ultra · Tavily`;
    const body = $("#hero-body"); body.replaceChildren();
    if (!inc) {
      $("#headline").textContent = running ? "Sentinel is scanning. Watch the record fill in." : "No open incident. Sentinel is watching every commit.";
      body.append(el("p", { class: "lede" }, running && last ? last.text : "When an advisory names a dependency a coding agent used, the record below opens, the 24-hour clock starts, and the early warning is drafted before anyone has read the advisory. A person files it."),
        el("div", { class: "cta" }, demoButton("btn primary"), el("span", { class: "note" }, "Real calls to Nemotron Nano, Nemotron Ultra and Tavily, about a minute.")));
      return;
    }
    const adv = inc.advisory, tri = inc.triage;
    $("#headline").textContent = inc.status === "filed" ? `Filed ${dur(parse(inc.approved_at) - parse(inc.awareness))} after awareness.`
      : inc.status === "review" ? `${inc.dependency} ${inc.version || ""} is compromised. The draft is ready.` : inc.status === "failed" ? "The pipeline stopped. The clock did not." : `${inc.dependency} ${inc.version || ""} is compromised. The clock is running.`;
    body.append(el("div", { class: "advisory" }, el("span", { class: "cite" }, adv.url ? el("a", { href: adv.url, target: "_blank", rel: "noopener" }, adv.advisory_id || "advisory") : adv.advisory_id || "advisory", ` · ${inc.dependency}${inc.version ? "@" + inc.version : ""} (npm)`, tri && tri.cvss ? ` · CVSS ${tri.cvss}` : "", ` · ${inc.source} feed, ${fmtT(inc.opened_at)}`), adv.title || "Advisory matched a watched dependency."),
      el("p", { class: "lede" }, tri ? tri.summary : "The pipeline is tracing which agent sessions and commits are downstream of the component."),
      el("div", { class: "cta" }, inc.status === "review" ? el("a", { class: "btn primary", href: "#draft" }, "Review the early warning") : null, inc.status === "filed" ? demoButton("btn primary") : null,
        inc.draft ? el("a", { class: "btn", href: `/api/incidents/${inc.id}/draft.md`, download: `${inc.id}-early-warning.md` }, "Download the draft") : null,
        el("a", { class: "btn", href: "https://github.com/cvikl/cra-watch", rel: "noopener" }, "Source on GitHub")));
  }
  function stepStatus(inc, key) {
    const idx = ORDER.indexOf(key === "detect" ? "detected" : key), cur = ORDER.indexOf(inc.status);
    if (inc.status === "failed") { const last = inc.steps.length ? ORDER.indexOf(inc.steps[inc.steps.length - 1].name) : 0; return idx <= last ? "done" : idx === last + 1 ? "failed" : "pending"; }
    if (key === "review") return inc.status === "filed" ? "done" : inc.status === "review" ? "running" : "pending";
    if (idx <= cur || inc.status === "filed") return "done";
    if (idx === cur + 1 && inc.status !== "review") return "running";
    return "pending";
  }
  function steps(inc) {
    const scanned = state.commits.filter((c) => c.flag), flagged = scanned.filter((c) => c.flag.risk !== "none");
    const sRunning = !!state.jobs.sentinel || (!!state.jobs.demo && !inc && !scanned.length);
    const items = [{ name: "Sentinel.", actor: "Nemotron Nano · at commit time", st: sRunning ? "running" : scanned.length ? "done" : "pending", at: scanned.length ? scanned[0].flag.scanned_at : null,
      text: scanned.length ? `${scanned.length} agent commits scanned, ${flagged.length} flagged before any advisory: ${flagged.map((c) => `${c.session_label} ${c.flag.risk}`).join(", ") || "none"}.` : "Reads what each agent commit read and wrote and flags vulnerability patterns before a CVE exists." }];
    const explain = { detect: "Tavily polls NVD, GitHub Advisories, OSV and the vendor bulletins for every watched dependency.", trace: "The provenance records give the affected commits, sessions, files and the last clean commit to roll back to.", read: "Tavily reads the advisory in full.", triage: "Severity, data at risk, and whether Article 14 applies.", context: "Background on the vulnerability class and the CRA Article 14 guidance.", draft: "The Article 14(4)(a) early warning, from the evidence only.", review: "A person reads it and approves. Nothing is sent without them." };
    for (const [key, name, actor] of STEPS) {
      const st = inc ? stepStatus(inc, key) : "pending";
      const rec = inc && (key === "detect" ? { at: inc.opened_at, text: `${inc.advisory.advisory_id || "Advisory"} matched on the ${inc.source} feed.` } : inc.steps.find((s) => s.name === key));
      const text = !inc ? explain[key] : key === "review" ? (inc.status === "filed" ? `Approved by the ${inc.approved_by}.` : inc.status === "review" ? "Waiting for approval below." : explain.review) : st === "failed" ? "Stopped here." : rec?.text || explain[key];
      items.push({ name: name + ".", actor, st, at: rec?.at, text });
    }
    return el("ol", { class: "steps" }, ...items.map((it) => el("li", { class: it.st }, el("div", {}, el("strong", {}, it.name), " ", el("span", { class: "text" }, it.text)), el("span", { class: "tag" }, it.st === "done" && it.at ? `${it.actor} · ${hhmm(it.at)}` : it.st === "running" ? `${it.actor} · running` : it.st === "failed" ? `${it.actor} · failed` : it.actor))));
  }
  function statTile(value, label, cls) { return el("div", {}, el("b", { class: cls || "" }, value), el("span", {}, label)); }
  function renderIncident(inc) {
    const t = inc.taint, tri = inc.triage, filed = inc.status === "filed", out = [];
    out.push(el("section", {}, el("p", { class: "label" }, "The clock"), el("h2", {}, filed ? "Article 14(4)(a) early warning, filed" : "Article 14(4)(a) early warning, due within 24 hours of awareness"),
      el("div", { class: "stats" },
        el("div", {}, el("b", { class: `clock${filed ? " stopped" : ""}`, id: "clock" }, "–"), el("span", {}, filed ? "time from awareness to filing" : "left in the 24-hour window")),
        statTile(fmtT(inc.awareness).replace(" UTC", ""), "awareness, UTC"),
        statTile(tri ? `${tri.severity} ${tri.cvss || ""}` : inc.status === "failed" ? "–" : "…", tri ? "severity, Nemotron Nano" : "severity"),
        statTile(t ? `${t.affected.length} → ${(inc.prior_flags || []).length}` : "…", t ? `affected commits across ${t.sessions.length} sessions; ${(inc.prior_flags || []).length} already flagged by Sentinel before the advisory` : "affected commits"))));
    out.push(el("section", {}, el("p", { class: "label" }, "Pipeline"), el("h2", {}, "Eight steps, one of them a person"), steps(inc),
      inc.error ? el("div", { class: "flash" }, el("span", {}, inc.error), el("button", { class: "btn small", type: "button", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/rerun`) }, "Re-run")) : null));
    if (t) {
      const flags = Object.fromEntries((inc.prior_flags || []).map((f) => [f.short, f]));
      out.push(el("section", {}, el("p", { class: "label" }, "Blast radius"), el("h2", {}, `What the agent wrote after reading ${inc.dependency}`),
        el("p", {}, `First read in session ${t.first_read?.session_label || "–"} on ${fmtT(t.first_read?.at)}. Roll back to `, el("code", {}, t.rollback_short || "n/a"), " and remove the dependency."),
        el("div", { class: "tbl" }, el("table", {}, el("thead", {}, el("tr", {}, ...["Commit", "Session", "Agent run", "Files written", "Sentinel"].map((h) => el("th", {}, h)))),
          el("tbody", {}, ...t.affected.map((c) => { const f = flags[c.short]; return el("tr", {}, el("td", {}, el("code", {}, c.short)), el("td", {}, c.session_label), el("td", {}, c.subject.replace(/^bob: /, "")), el("td", {}, el("code", {}, c.wrote.join(", ") || "–")), el("td", {}, f ? el("span", { class: `s ${sev(f.risk)}` }, f.risk) : el("span", { class: "s n" }, "none"))); }),
            t.rollback_commit ? el("tr", { class: "rollback" }, el("td", {}, el("code", {}, t.rollback_short)), el("td"), el("td", { colspan: 3 }, "Last clean commit")) : null)))));
    }
    const ctx = inc.context || {}, srcs = [["advisory", inc.advisory.url, inc.advisory.title], ...(ctx.class_background || []).map((r) => ["background", r.url, r.title]), ...(ctx.cra_guidance || []).map((r) => ["CRA guidance", r.url, r.title])].filter((x) => x[1]);
    const d = inc.draft;
    const draft = el("section", { id: "draft" }, el("p", { class: "label" }, "Early warning"), el("h2", {}, d ? "Drafted by Nemotron Ultra, filed by a person" : "Waiting for the draft"));
    if (!d) draft.append(el("p", {}, inc.status === "failed" ? "No draft: the pipeline stopped before Nemotron Ultra ran." : "The draft appears here once Nemotron Ultra has read the advisory, the trace, the triage and the CRA guidance."));
    else {
      draft.append(el("div", { class: "doc", html: DOMPurify.sanitize(marked.parse(d.text)).replace(/&lt;([^&]{2,140}?)&gt;/g, '<span class="ph">&lt;$1&gt;</span>') }));
      const cta = el("div", { class: "cta" });
      if (inc.status === "review") cta.append(el("button", { class: "btn primary", type: "button", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/approve`, { by: "compliance lead" }) }, "Approve and file"), el("span", { class: "note" }, "Approval stops the clock. You paste the text into the ENISA reporting platform yourself."));
      if (filed) cta.append(el("span", { class: "s v" }, `approved and filed · ${inc.approved_by} · ${fmtT(inc.approved_at)}`));
      cta.append(el("button", { class: "btn small", type: "button", onclick: (e) => copyDraft(e.target, inc) }, "Copy"), el("a", { class: "btn small", href: `/api/incidents/${inc.id}/draft.md`, download: `${inc.id}-early-warning.md` }, "Download .md"));
      draft.append(cta, el("p", { class: "note", style: "margin-top:12px" }, `${d.model} · ${d.elapsed_s} s · ${d.prompt_tokens || "?"} prompt tokens, ${d.completion_tokens || "?"} completion tokens · all inference through Nebius Token Factory`));
    }
    out.push(draft);
    if (srcs.length) out.push(el("section", {}, el("p", { class: "label" }, "Sources"), el("h2", {}, `${srcs.length} sources read by Tavily`),
      el("div", { class: "tbl" }, el("table", {}, el("thead", {}, el("tr", {}, el("th", {}, "Use"), el("th", {}, "Source"))), el("tbody", {}, ...srcs.map(([use, url, tt]) => el("tr", {}, el("td", {}, el("span", { class: "s n" }, use)), el("td", {}, el("a", { href: url, target: "_blank", rel: "noopener" }, tt || url)))))))));
    return out;
  }
  function renderEmpty() {
    return [el("section", {}, el("p", { class: "label" }, "Pipeline"), el("h2", {}, "Eight steps, one of them a person"), steps(null))];
  }

  // ------------------------------------------------------------------ register (details)
  function renderWatchlist() {
    $("#watchlist").replaceChildren(el("thead", {}, el("tr", {}, ...["Dependency", "Feed", "Last poll", "Result"].map((h) => el("th", {}, h)))),
      el("tbody", {}, ...state.watchlist.map((d) => el("tr", {}, el("td", {}, el("code", {}, `${d.name}${d.version ? "@" + d.version : ""}`)), el("td", {}, d.bulletins?.length ? "bulletin + advisory search" : "advisory search"), el("td", {}, d.last_checked ? hhmm(d.last_checked) : "–"), el("td", {}, d.last_result && /^(CVE|GHSA)/.test(d.last_result) ? el("span", { class: "s d" }, d.last_result) : el("span", { class: "s n" }, d.last_result || "not polled"))))));
    $("#monitor-note").textContent = `Tavily polls NVD, GitHub Advisories, OSV, cve.org, Snyk and Socket plus the registered vendor bulletins every ${Math.round(state.config.interval_s / 60)} minutes, on a Nebius Serverless Job.`;
    const b = $("#btn-monitor"); b.disabled = !state.config.tavily || !!state.jobs.monitor; b.textContent = state.jobs.monitor ? "Polling…" : "Poll feeds";
  }
  function renderCommits() {
    $("#commits").replaceChildren(el("thead", {}, el("tr", {}, ...["Commit", "Session", "Agent run", "Risk"].map((h) => el("th", {}, h)))),
      el("tbody", {}, ...state.commits.map((c) => { const r = c.flag ? c.flag.risk : null; return el("tr", {}, el("td", {}, el("button", { class: "row-btn mono", type: "button", onclick: () => { selectedCommit = selectedCommit === c.sha ? null : c.sha; renderCommitDetail(); } }, c.short)), el("td", {}, c.session_label), el("td", {}, c.subject.replace(/^bob: /, "")), el("td", {}, r == null ? el("span", { class: "s n" }, "not scanned") : el("span", { class: `s ${sev(r)}` }, r === "none" ? "clean" : r))); })));
    const b = $("#btn-sentinel"); b.disabled = !state.config.nebius || !!state.jobs.sentinel; b.textContent = state.jobs.sentinel ? "Scanning…" : "Run scan";
    renderCommitDetail();
  }
  function renderCommitDetail() {
    const root = $("#commit-detail"), c = state.commits.find((x) => x.sha === selectedCommit); root.replaceChildren(); if (!c) return;
    const f = c.flag;
    root.append(el("p", {}, el("strong", {}, `${c.short} · session ${c.session_label}`), ` · ${c.subject}`), el("p", { class: "note" }, "Read: ", el("code", {}, c.read.join(", ") || "–"), " · Wrote: ", el("code", {}, c.wrote.join(", ") || "–")));
    if (f) root.append(el("p", {}, el("span", { class: `s ${sev(f.risk)}` }, f.risk), ` ${(f.classes || []).join(", ")}${f.cwe?.length ? " · " + f.cwe.join(", ") : ""} · ${f.model ? "classified by " + f.model : "pattern scan only"}`), el("p", {}, f.summary), el("ul", { class: "evidence" }, ...[...new Set([...(f.evidence || []), ...(f.findings || []).map((x) => `${x.source}: ${x.title} — ${x.evidence}`)])].map((e) => el("li", {}, e))));
  }
  function renderJournal() {
    $("#journal").replaceChildren(el("tbody", {}, ...state.events.slice(-14).reverse().map((e) => el("tr", {}, el("td", {}, el("code", {}, hhmm(e.at))), el("td", {}, el("span", { class: `s ${/error|detect/.test(e.kind) ? "d" : e.kind === "filed" ? "v" : "n"}` }, e.kind)), el("td", {}, e.text)))));
  }
  function renderLedger() {
    const calls = state.calls.slice().reverse(), nebius = state.calls.filter((c) => c.provider === "nebius"), tav = state.calls.filter((c) => c.provider === "tavily");
    const tokens = nebius.reduce((a, c) => a + (c.prompt_tokens || 0) + (c.completion_tokens || 0), 0);
    $("#ledger-title").textContent = `Run ledger: ${nebius.length} Nemotron calls, ${tokens.toLocaleString()} tokens, ${tav.length} Tavily calls`;
    $("#ledger").replaceChildren(el("thead", {}, el("tr", {}, ...["Time", "System", "Call", "Model", "Tokens", "Elapsed"].map((h) => el("th", {}, h)))),
      el("tbody", {}, ...calls.slice(0, 40).map((c) => el("tr", {}, el("td", {}, el("code", {}, hhmm(c.at))), el("td", {}, c.provider === "nebius" ? "Token Factory" : "Tavily", c.fixture ? el("span", { class: "s h" }, " fixture") : null), el("td", {}, c.op), el("td", {}, el("code", {}, c.model ? c.model.split("/").pop() : "–")), el("td", {}, c.prompt_tokens != null ? `${c.prompt_tokens} + ${c.completion_tokens}` : c.error ? "error" : c.results != null ? `${c.results} results` : "–"), el("td", {}, `${c.elapsed_s} s`)))));
  }

  // ------------------------------------------------------------------ clock
  function startClock(inc) {
    clearInterval(clockTimer);
    const node = $("#clock"), bt = null, target = inc; if (!target || !node) return;
    const due = parse(target.deadlines.early_warning_24h);
    const tick = () => {
      let text, stopped = false;
      if (target.status === "filed") { text = dur(parse(target.approved_at) - parse(target.awareness)); stopped = true; }
      else { const left = due - Date.now(); text = (left < 0 ? "-" : "") + dur(Math.abs(left)); }
      for (const n of [node, bt]) { if (!n) continue; n.textContent = text; n.classList.toggle("stopped", stopped); }
    };
    tick(); clockTimer = setInterval(tick, 1000);
  }

  // ------------------------------------------------------------------ actions
  async function act(btn, path, body) {
    const label = btn.textContent; btn.disabled = true; btn.textContent = "Working…";
    try { await api(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }); await refresh(); }
    catch (e) { btn.disabled = false; btn.textContent = label; alert(e.message); }
  }
  async function copyDraft(btn, inc) {
    try { await navigator.clipboard.writeText(inc.draft.text); btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1500); }
    catch { window.open(`/api/incidents/${inc.id}/draft.md`, "_blank"); }
  }
  $("#btn-monitor").addEventListener("click", (e) => act(e.target, "/api/monitor/run"));
  $("#btn-sentinel").addEventListener("click", (e) => act(e.target, "/api/sentinel/run"));

  // ------------------------------------------------------------------ live
  function connect() {
    const es = new EventSource("/api/events");
    const dot = $("#live-dot");
    es.onopen = () => { dot.textContent = "live"; dot.className = "s v"; };
    es.onerror = () => { dot.textContent = "offline"; dot.className = "s n"; };
    es.onmessage = scheduleRefresh;
  }
  refresh().then(connect).catch((e) => { $("#report").textContent = `Cannot load state: ${e.message}`; });
})();
