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
  const RISK_LABEL = { none: "", low: "Label--accent", medium: "Label--attention", high: "Label--danger", critical: "Label--danger" };

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
  function render() {
    const inc = currentIncident();
    $("#report").replaceChildren(inc ? renderIncident(inc) : renderEmpty());
    renderWatchlist(); renderCommits(); renderJournal(); renderLedger();
    startClock(inc);
  }
  function demoButton(cls) {
    const d = state.demo || {}, running = !!state.jobs.demo;
    if (running) return el("span", { class: "State State--open" }, "Demo running");
    return el("button", { class: cls, type: "button", disabled: !d.available || !d.can_start, title: d.reason || "Sentinel, detection, trace, triage and draft run with real calls while you watch. About a minute.", onclick: (e) => act(e.target, "/api/demo/run") }, "Run the live demo");
  }
  function title(text, right, sub) {
    return el("div", { class: "d-flex flex-items-start mb-4" }, el("div", { class: "flex-auto" }, el("h1", { class: "f2 text-semibold lh-condensed" }, text), sub ? el("div", { class: "color-fg-muted mt-1" }, sub) : null), right);
  }
  function stepStatus(inc, key) {
    const idx = ORDER.indexOf(key === "detect" ? "detected" : key), cur = ORDER.indexOf(inc.status);
    if (inc.status === "failed") { const last = inc.steps.length ? ORDER.indexOf(inc.steps[inc.steps.length - 1].name) : 0; return idx <= last ? "done" : idx === last + 1 ? "failed" : "pending"; }
    if (key === "review") return inc.status === "filed" ? "done" : inc.status === "review" ? "running" : "pending";
    if (idx <= cur || inc.status === "filed") return "done";
    if (idx === cur + 1 && inc.status !== "review") return "running";
    return "pending";
  }
  function timeline(inc) {
    const scanned = state.commits.filter((c) => c.flag), flagged = scanned.filter((c) => c.flag.risk !== "none");
    const running = !!state.jobs.sentinel || (!!state.jobs.demo && !inc && !scanned.length);
    const items = [{ name: "Sentinel", actor: "Nemotron Nano, at commit time", st: running ? "running" : scanned.length ? "done" : "pending",
      text: scanned.length ? `${scanned.length} agent commits scanned, ${flagged.length} flagged before any advisory${flagged.length ? ": " + flagged.map((c) => `${c.session_label} ${c.flag.risk}`).join(", ") : ""}` : "Reads what each agent commit read and wrote; flags vulnerability patterns before a CVE exists.",
      at: scanned.length ? scanned[0].flag.scanned_at : null }];
    for (const [key, name, actor] of STEPS) {
      const st = inc ? stepStatus(inc, key) : "pending";
      const rec = inc && (key === "detect" ? { at: inc.opened_at, text: `${inc.advisory.advisory_id || "Advisory"} matched on the ${inc.source} feed` } : inc.steps.find((s) => s.name === key));
      const text = !inc ? { detect: "Tavily polls NVD, GitHub Advisories, OSV and vendor bulletins.", trace: "Provenance records give the affected commits, sessions, files and the clean rollback commit.", read: "Tavily reads the advisory in full.", triage: "Severity, data at risk, does Article 14 apply.", context: "Background on the vulnerability class and the CRA guidance.", draft: "The Article 14(4)(a) early warning, from the evidence only.", review: "A person reads it and approves. Nothing is sent without them." }[key]
        : key === "review" ? (inc.status === "filed" ? `Approved by the ${inc.approved_by}` : inc.status === "review" ? "Waiting for your approval below" : "") : st === "failed" ? "Stopped here" : rec?.text;
      items.push({ name, actor, st, text, at: rec?.at });
    }
    return el("div", {}, ...items.map((it, n) => el("div", { class: "TimelineItem TimelineItem--condensed" },
      el("div", { class: it.st === "done" ? "TimelineItem-badge TimelineItem-badge--success" : `TimelineItem-badge ${it.st}`, html: it.st === "done" ? ICON.check : it.st === "failed" ? ICON.x : ICON.dot }),
      el("div", { class: "TimelineItem-body" },
        el("div", {}, el("span", { class: "text-semibold color-fg-default" }, it.name), el("span", { class: "color-fg-muted" }, ` · ${it.actor}`), it.at ? el("span", { class: "f6 color-fg-muted float-right" }, hhmm(it.at)) : null),
        it.text ? el("div", { class: "f6 color-fg-muted" }, it.text) : null))));
  }
  function renderIncident(inc) {
    const adv = inc.advisory, tri = inc.triage, t = inc.taint, filed = inc.status === "filed";
    const stateLabel = { filed: ["State State--merged", "Filed"], failed: ["State State--closed", "Pipeline failed"], review: ["State State--open", "Awaiting approval"] }[inc.status] || ["State State--draft", inc.status];
    const root = el("div", {},
      title(incNo(inc), el("div", { class: "d-flex flex-items-center" }, el("span", { class: `${stateLabel[0]} mr-2` }, stateLabel[1]), filed ? demoButton("btn btn-sm") : null),
        el("span", {}, `${inc.dependency}${inc.version ? "@" + inc.version : ""} · `, adv.url ? el("a", { href: adv.url, target: "_blank", rel: "noopener" }, adv.advisory_id || "advisory") : adv.advisory_id || "advisory", tri ? el("span", {}, " · ", el("span", { class: `Label ${RISK_LABEL[tri.severity] || ""}` }, `${tri.severity}${tri.cvss ? " " + tri.cvss : ""}`)) : null)),
      el("div", { class: "mb-5" },
        el("div", { class: "f6 color-fg-muted" }, filed ? "Filed after" : "Early warning due in"),
        el("div", { class: "clock", id: "clock" }, "–"),
        el("div", { class: "f6 color-fg-muted mt-1" }, `Awareness ${fmtT(inc.awareness)} · 24 h ${fmtT(inc.deadlines.early_warning_24h)} · 72 h ${fmtT(inc.deadlines.notification_72h)}`)),
      el("h2", { class: "f4 text-semibold mb-2" }, "Pipeline"), timeline(inc),
      inc.error ? el("div", { class: "flash flash-error d-flex flex-items-center mt-3" }, el("span", { class: "flex-auto" }, inc.error), el("button", { class: "btn btn-sm", type: "button", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/rerun`) }, "Re-run")) : null,
    );
    if (t) root.append(el("details", { class: "mt-4" }, el("summary", { class: "color-fg-muted" }, `${t.affected.length} affected commits across sessions ${t.session_labels.join(", ")}, roll back to ${t.rollback_short || "n/a"}`),
      el("div", { class: "Box mt-2" }, ...t.affected.map((c) => { const f = (inc.prior_flags || []).find((x) => x.short === c.short); return el("div", { class: "Box-row row-grid affected-row f6" }, el("span", { class: "text-mono color-fg-accent" }, c.short), el("span", { class: "color-fg-muted" }, c.session_label), el("span", {}, c.subject.replace(/^bob: /, ""), el("div", { class: "color-fg-muted text-mono" }, c.wrote.join(", "))), f ? el("span", { class: `Label ${RISK_LABEL[f.risk]}` }, `Sentinel ${f.risk}`) : el("span")); }),
        t.rollback_commit ? el("div", { class: "Box-row row-grid affected-row f6 color-bg-success" }, el("span", { class: "text-mono color-fg-accent" }, t.rollback_short), el("span"), el("span", {}, "Last clean commit"), el("span")) : null)));
    const ctx = inc.context || {}, srcs = [["advisory", adv.url, adv.title], ...(ctx.class_background || []).map((r) => ["class", r.url, r.title]), ...(ctx.cra_guidance || []).map((r) => ["CRA", r.url, r.title])].filter((x) => x[1]);
    if (srcs.length) root.append(el("details", { class: "mt-2" }, el("summary", { class: "color-fg-muted" }, `${srcs.length} sources read by Tavily`), el("ul", { class: "list-style-none mt-2 f6" }, ...srcs.map(([via, url, tt]) => el("li", { class: "py-1" }, el("span", { class: "Label mr-2" }, via), el("a", { href: url, target: "_blank", rel: "noopener" }, tt || url))))));
    root.append(renderDraft(inc));
    return root;
  }
  function renderDraft(inc) {
    const d = inc.draft, sec = el("section", { class: "mt-5" }, el("h2", { class: "f4 text-semibold mb-2" }, "Early warning", d ? el("span", { class: "f6 color-fg-muted text-normal ml-2" }, `drafted by Nemotron Ultra in ${d.elapsed_s} s`) : null));
    if (!d) { sec.append(el("p", { class: "color-fg-muted" }, inc.status === "failed" ? "No draft: the pipeline stopped before Nemotron Ultra ran." : "The draft appears here once Nemotron Ultra has read the advisory, the trace, the triage and the CRA guidance.")); return sec; }
    const html = DOMPurify.sanitize(marked.parse(d.text)).replace(/&lt;([^&]{2,140}?)&gt;/g, '<span class="ph">&lt;$1&gt;</span>');
    sec.append(el("div", { class: "markdown-body Box p-4", html }));
    const foot = el("div", { class: "d-flex flex-items-center flex-wrap mt-3" });
    if (inc.status === "review") foot.append(el("button", { class: "btn btn-primary btn-large mr-3", type: "button", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/approve`, { by: "compliance lead" }) }, "Approve and file"), el("span", { class: "f6 color-fg-muted" }, "Approval stops the clock. You paste the text into the ENISA platform yourself."));
    if (inc.status === "filed") foot.append(el("span", { class: "Label Label--success Label--large mr-3" }, `Approved and filed ${dur(parse(inc.approved_at) - parse(inc.awareness))} after awareness`), el("span", { class: "f6 color-fg-muted" }, `${inc.approved_by} · ${fmtT(inc.approved_at)}`));
    foot.append(el("span", { class: "ml-auto" }, el("button", { class: "btn btn-sm mr-1", type: "button", onclick: (e) => copyDraft(e.target, inc) }, "Copy"), el("a", { class: "btn btn-sm", href: `/api/incidents/${inc.id}/draft.md`, download: `${inc.id}-early-warning.md` }, "Download")));
    sec.append(foot);
    return sec;
  }
  function renderEmpty() {
    const running = !!state.jobs.demo;
    return el("div", {},
      title("No open incident", demoButton("btn btn-primary"), running ? (state.events[state.events.length - 1] || {}).text : "When an advisory matches a watched dependency, the incident opens here and the 24 h clock starts."),
      el("h2", { class: "f4 text-semibold mb-2" }, "Pipeline"), timeline(null));
  }

  // ------------------------------------------------------------------ details (footer)
  function renderWatchlist() {
    $("#watchlist").replaceChildren(...state.watchlist.map((d) => el("div", { class: "Box-row row-grid watch-row f6" },
      el("span", {}, el("span", { class: "text-semibold" }, d.name), el("span", { class: "color-fg-muted" }, d.version ? ` @${d.version}` : "", d.last_checked ? ` · polled ${hhmm(d.last_checked)}` : "")),
      d.last_result && /^(CVE|GHSA)/.test(d.last_result) ? el("span", { class: "Label Label--danger" }, d.last_result) : el("span", { class: "color-fg-muted" }, d.last_result || "not polled"))));
    const b = $("#btn-monitor"); b.disabled = !state.config.tavily || !!state.jobs.monitor; b.textContent = state.jobs.monitor ? "Polling…" : "Poll feeds";
  }
  function renderCommits() {
    $("#commits").replaceChildren(...state.commits.map((c) => { const risk = c.flag ? c.flag.risk : null; return el("div", { class: `Box-row row-grid commit-row f6${selectedCommit === c.sha ? " selected" : ""}`, role: "button", tabindex: 0, onclick: () => { selectedCommit = selectedCommit === c.sha ? null : c.sha; renderCommits(); renderCommitDetail(); } },
      el("span", { class: "text-mono color-fg-accent" }, c.short), el("span", { class: "Truncate" }, el("span", { class: "Truncate-text" }, el("span", { class: "color-fg-muted" }, `${c.session_label} `), c.subject.replace(/^bob: /, ""))),
      risk == null ? el("span", { class: "color-fg-muted" }, "–") : risk === "none" ? el("span", { class: "color-fg-muted" }, "clean") : el("span", { class: `Label ${RISK_LABEL[risk]}` }, risk)); }));
    const b = $("#btn-sentinel"); b.disabled = !state.config.nebius || !!state.jobs.sentinel; b.textContent = state.jobs.sentinel ? "Scanning…" : "Run scan";
    renderCommitDetail();
  }
  function renderCommitDetail() {
    const root = $("#commit-detail"), c = state.commits.find((x) => x.sha === selectedCommit);
    root.replaceChildren(); if (!c) return;
    const f = c.flag;
    root.append(el("div", { class: "Box-row f6" }, el("div", { class: "text-semibold mb-1" }, `${c.short} · session ${c.session_label} · ${c.subject}`),
      el("div", { class: "color-fg-muted" }, "Read: ", el("span", { class: "text-mono" }, c.read.join(", ") || "–")), el("div", { class: "color-fg-muted" }, "Wrote: ", el("span", { class: "text-mono" }, c.wrote.join(", ") || "–")),
      f ? el("div", { class: "mt-2" }, el("span", { class: `Label ${RISK_LABEL[f.risk]} mr-1` }, f.risk), (f.classes || []).join(", "), f.cwe?.length ? ` · ${f.cwe.join(", ")}` : "", el("div", { class: "mt-1" }, f.summary), el("ul", { class: "list-style-none mt-2" }, ...[...new Set([...(f.evidence || []), ...(f.findings || []).map((x) => `${x.source}: ${x.title} — ${x.evidence}`)])].map((e) => el("li", { class: "text-mono color-bg-subtle rounded-2 p-2 mb-1", style: "white-space:pre-wrap;overflow-wrap:anywhere" }, e)))) : el("div", { class: "mt-2 color-fg-muted" }, "not scanned yet")));
  }
  function renderJournal() {
    $("#journal").replaceChildren(...state.events.slice(-12).reverse().map((e) => el("div", { class: "Box-row row-grid journal-row f6" }, el("span", { class: "text-mono color-fg-muted" }, hhmm(e.at)), el("span", {}, el("span", { class: "text-semibold color-fg-muted mr-1" }, e.kind), e.text))));
  }
  function renderLedger() {
    const calls = state.calls.slice().reverse(), nebius = state.calls.filter((c) => c.provider === "nebius"), tav = state.calls.filter((c) => c.provider === "tavily");
    const tokens = nebius.reduce((a, c) => a + (c.prompt_tokens || 0) + (c.completion_tokens || 0), 0);
    $("#ledger-title").textContent = `Run ledger · ${nebius.length} Nemotron calls · ${tokens.toLocaleString()} tokens · ${tav.length} Tavily calls`;
    $("#ledger").replaceChildren(...calls.slice(0, 40).map((c) => el("div", { class: "Box-row row-grid ledger-row f6" }, el("span", { class: "text-mono color-fg-muted" }, hhmm(c.at)), el("span", {}, c.provider === "nebius" ? "Token Factory" : "Tavily", c.fixture ? el("span", { class: "Label Label--attention ml-1" }, "fixture") : null),
      el("span", { class: "text-mono" }, c.op, c.model ? ` · ${c.model}` : ""), el("span", { class: "text-mono color-fg-muted" }, c.prompt_tokens != null ? `${c.prompt_tokens} + ${c.completion_tokens} tok` : c.error ? "error" : c.results != null ? `${c.results} results` : ""), el("span", { class: "text-mono color-fg-muted" }, `${c.elapsed_s} s`))));
  }

  // ------------------------------------------------------------------ clock
  function startClock(inc) {
    clearInterval(clockTimer);
    const node = $("#clock"), band = $("#band-clock"), bt = $(".bc-time", band), live = currentIncident();
    band.hidden = !live;
    if (live) $(".bc-label", band).textContent = live.status === "filed" ? "filed after" : "due in";
    const target = inc || live; if (!target) return;
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
    es.onopen = () => { dot.textContent = "live"; dot.className = "Label Label--success"; };
    es.onerror = () => { dot.textContent = "offline"; dot.className = "Label"; };
    es.onmessage = scheduleRefresh;
  }
  refresh().then(connect).catch((e) => { $("#report").textContent = `Cannot load state: ${e.message}`; });
})();
