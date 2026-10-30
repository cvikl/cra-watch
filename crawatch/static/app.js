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

  // ------------------------------------------------------------------ header
  function renderHeader() {
    const c = state.config;
    const items = [["Nebius Token Factory", c.nebius, c.fake_llm ? "fixture mode" : c.nebius ? "connected" : "no key"], ["Nemotron Nano", c.nebius, c.nano], ["Nemotron Ultra", c.nebius, c.ultra], ["Tavily", c.tavily, c.tavily ? "connected" : "no key"]];
    $("#systems").replaceChildren(...items.map(([name, on, title]) => el("span", { class: `Label mr-1 ${on ? "Label--success" : "Label--danger"}`, title }, name)));
  }

  // ------------------------------------------------------------------ sidebar
  function renderWatchlist() {
    const shown = watchOpen ? state.watchlist : state.watchlist.slice(0, 4);
    const rows = shown.map((d) => el("div", { class: "Box-row watch-row" },
      el("div", {}, el("span", { class: "text-semibold" }, d.name), el("span", { class: "color-fg-muted" }, d.version ? ` @${d.version}` : ""),
        el("div", { class: "f6 color-fg-muted" }, d.added_in ? `added in ${d.added_in} · ` : "", d.bulletins?.length ? "bulletin feed + advisory search" : "advisory search", d.last_checked ? ` · polled ${hhmm(d.last_checked)}` : "")),
      d.last_result && /^(CVE|GHSA)/.test(d.last_result) ? el("span", { class: "Label Label--danger" }, d.last_result) : el("span", { class: "Label" }, d.last_result || "not polled")));
    if (state.watchlist.length > 4) rows.push(el("div", { class: "Box-row" }, el("button", { class: "btn-link f6", onclick: () => { watchOpen = !watchOpen; render(); } }, watchOpen ? "Show fewer" : `Show all ${state.watchlist.length} watched`)));
    $("#watchlist").replaceChildren(...rows);
    $("#monitor-note").textContent = `Polls NVD, GitHub Advisories, OSV and vendor bulletins through Tavily every ${Math.round(state.config.interval_s / 60)} min on a Nebius Serverless Job.`;
    const b = $("#btn-monitor"); b.disabled = !state.config.tavily || !!state.jobs.monitor; b.textContent = state.jobs.monitor ? "Polling…" : "Poll feeds";
  }
  function renderCommits() {
    const scanned = state.commits.filter((c) => c.flag).length, flagged = state.commits.filter((c) => c.flag && c.flag.risk !== "none").length;
    $("#sentinel-note").textContent = scanned ? `${scanned} of ${state.commits.length} agent commits scanned, ${flagged} flagged before any advisory.` : "Not scanned yet. Sentinel reads what each agent commit read and wrote and Nemotron Nano classifies the risk.";
    $("#commits").replaceChildren(...state.commits.map((c) => {
      const risk = c.flag ? c.flag.risk : null;
      return el("div", { class: `Box-row commit-row${selectedCommit === c.sha ? " selected" : ""}`, role: "button", tabindex: 0, title: c.subject,
        onclick: () => { selectedCommit = c.sha; selectedIncident = null; render(); }, onkeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectedCommit = c.sha; selectedIncident = null; render(); } } },
        el("span", { class: "text-mono f6 color-fg-accent" }, c.short),
        el("span", { class: "Truncate" }, el("span", { class: "Truncate-text f6" }, el("span", { class: "color-fg-muted" }, `${c.session_label} `), c.subject.replace(/^bob: /, ""))),
        risk == null ? el("span", { class: "f6 color-fg-muted" }, "–") : risk === "none" ? el("span", { class: "f6 color-fg-muted" }, "clean") : el("span", { class: `Label ${RISK_LABEL[risk]}` }, risk));
    }));
    const b = $("#btn-sentinel"); b.disabled = !state.config.nebius || !!state.jobs.sentinel; b.textContent = state.jobs.sentinel ? "Scanning…" : "Run scan";
  }
  function renderJournal() {
    $("#journal").replaceChildren(...state.events.slice(-12).reverse().map((e) => el("div", { class: "Box-row journal-row f6" },
      el("span", { class: "text-mono color-fg-muted" }, hhmm(e.at)),
      el("span", {}, el("span", { class: `text-semibold mr-1 ${/error|detect/.test(e.kind) ? "color-fg-danger" : e.kind === "filed" ? "color-fg-success" : "color-fg-muted"}` }, e.kind), e.text))));
  }

  // ------------------------------------------------------------------ report
  const currentIncident = () => state.incidents.length ? (state.incidents.find((i) => i.id === selectedIncident) || state.incidents[0]) : null;
  function render() {
    renderHeader(); renderWatchlist(); renderCommits(); renderJournal();
    const report = $("#report"), inc = selectedCommit ? null : currentIncident();
    report.replaceChildren(renderDemo());
    if (state.incidents.length > 1 && !selectedCommit) report.append(renderTabs());
    report.append(inc ? renderIncident(inc) : renderEmpty());
    report.append(renderLedger());
    startClock(inc);
  }
  function renderDemo() {
    const d = state.demo || {}, running = !!state.jobs.demo, last = state.events[state.events.length - 1];
    return el("div", { class: "Box Box--blue mb-3" }, el("div", { class: "Box-body d-flex flex-items-center flex-wrap gutter-condensed" },
      el("div", { class: "flex-auto col-12 col-md-8" },
        el("div", { class: "text-semibold" }, running ? "Demo running" : "Run the scenario yourself"),
        el("div", { class: "f6 color-fg-muted" }, running && last ? last.text : `Sentinel scans the agent commits with Nemotron Nano, Tavily reads the vendor bulletin for ${d.dependency || "the dependency"}, the provenance records give the blast radius, Nemotron Nano triages, Nemotron Ultra drafts the early warning. About a minute, real calls. Then approve it yourself.`),
        !running && d.reason ? el("div", { class: "f6 color-fg-attention" }, d.reason) : null),
      el("div", { class: "col-12 col-md-4 text-md-right mt-2 mt-md-0" }, el("button", { class: "btn btn-primary", type: "button", disabled: !d.available || running || !d.can_start, onclick: (e) => act(e.target, "/api/demo/run") }, running ? "Running…" : "Run the live demo"))));
  }
  function renderTabs() {
    return el("nav", { class: "UnderlineNav mb-3", "aria-label": "Incidents" }, el("div", { class: "UnderlineNav-body" }, ...state.incidents.map((i) =>
      el("button", { class: "UnderlineNav-item", type: "button", "aria-current": currentIncident().id === i.id ? "page" : null, onclick: () => { selectedIncident = i.id; selectedCommit = null; render(); } }, `${i.dependency} `, el("span", { class: "Counter" }, i.status)))));
  }
  function stepStatus(inc, key) {
    const idx = ORDER.indexOf(key === "detect" ? "detected" : key), cur = ORDER.indexOf(inc.status);
    if (inc.status === "failed") { const last = inc.steps.length ? ORDER.indexOf(inc.steps[inc.steps.length - 1].name) : 0; return idx <= last ? "done" : idx === last + 1 ? "failed" : "pending"; }
    if (key === "review") return inc.status === "filed" ? "done" : inc.status === "review" ? "running" : "pending";
    if (idx <= cur || inc.status === "filed") return "done";
    if (idx === cur + 1 && inc.status !== "review") return "running";
    return "pending";
  }
  function renderTimeline(inc) {
    return el("div", {}, ...STEPS.map(([key, name, actor], n) => {
      const st = inc ? stepStatus(inc, key) : "pending";
      const rec = inc && (key === "detect" ? { at: inc.opened_at, text: `${inc.advisory.advisory_id || "Advisory"} matched on the ${inc.source} feed` } : inc.steps.find((s) => s.name === key));
      const text = !inc ? "" : key === "review" ? (inc.status === "filed" ? `Approved by the ${inc.approved_by}` : inc.status === "review" ? "Awaiting approval" : "") : st === "failed" ? "Stopped here" : rec?.text;
      const badge = st === "done" ? "TimelineItem-badge TimelineItem-badge--success" : `TimelineItem-badge ${st}`;
      return el("div", { class: "TimelineItem TimelineItem--condensed" },
        el("div", { class: badge, html: st === "done" ? ICON.check : st === "failed" ? ICON.x : st === "running" ? ICON.clock : ICON.dot }),
        el("div", { class: "TimelineItem-body" },
          el("div", {}, el("span", { class: "text-semibold color-fg-default" }, `${n + 1}. ${name}`), el("span", { class: "color-fg-muted" }, ` · ${actor}`), rec?.at ? el("span", { class: "f6 color-fg-muted step-time float-right" }, hhmm(rec.at)) : null),
          text ? el("div", { class: "text f6" }, text) : null));
    }));
  }
  function summary(items) {
    return el("dl", { class: "summary d-flex flex-wrap gutter-condensed mb-0" }, ...items.map(([k, v, sub]) => el("div", { class: "col-6 col-md-4 mb-3" }, el("dt", {}, k), el("dd", {}, v), sub ? el("div", { class: "f6 color-fg-muted" }, sub) : null)));
  }
  function renderIncident(inc) {
    const tri = inc.triage, t = inc.taint, adv = inc.advisory;
    const stateLabel = { filed: ["State State--merged", "Filed"], failed: ["State State--closed", "Pipeline failed"], review: ["State State--open", "Awaiting approval"] }[inc.status] || ["State State--draft", inc.status];
    const box = el("div", { class: "Box mb-3" },
      el("div", { class: "Box-header d-flex flex-items-center" },
        el("div", { class: "flex-auto" }, el("h2", { class: "f3 text-semibold" }, incNo(inc)), el("div", { class: "f6 color-fg-muted" }, `Incident record · opened ${fmtT(inc.opened_at)} · early warning under CRA Art. 14(4)(a)`)),
        el("span", { class: stateLabel[0] }, stateLabel[1])),
      el("div", { class: "Box-body" }, summary([
        ["Dependency", `${inc.dependency}${inc.version ? "@" + inc.version : ""}`, "npm, introduced by an agent"],
        ["Advisory", adv.url ? el("a", { href: adv.url, target: "_blank", rel: "noopener" }, adv.advisory_id || "source") : adv.advisory_id || "–", adv.title],
        ["Severity", tri ? el("span", { class: `Label ${RISK_LABEL[tri.severity] || ""}` }, `${tri.severity}${tri.cvss ? " · " + tri.cvss : ""}`) : inc.status === "failed" ? "not assessed" : "pending", tri ? tri.vulnerability_class : ""],
        ["Awareness", fmtT(inc.awareness), "the clock starts here"],
        [inc.status === "filed" ? "Filed after" : "Early warning due in", el("span", { class: "clock", id: "clock" }, "–"), `24 h: ${fmtT(inc.deadlines.early_warning_24h)} · 72 h: ${fmtT(inc.deadlines.notification_72h)}`],
      ])),
      el("div", { class: "Box-row" }, el("h3", { class: "f5 mb-2" }, "Pipeline"), renderTimeline(inc)),
      inc.error ? el("div", { class: "Box-row" }, el("div", { class: "flash flash-error d-flex flex-items-center" }, el("span", { class: "flex-auto" }, inc.error), el("button", { class: "btn btn-sm", type: "button", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/rerun`) }, "Re-run pipeline"))) : null,
    );
    if (t) box.append(renderTaint(inc));
    if (tri) box.append(renderAssessment(inc));
    return el("div", {}, box, renderDraft(inc));
  }
  function renderTaint(inc) {
    const t = inc.taint, flags = Object.fromEntries((inc.prior_flags || []).map((f) => [f.short, f]));
    const rows = t.affected.map((c) => { const f = flags[c.short]; return el("div", { class: "Box-row affected-row f6" },
      el("span", { class: "text-mono color-fg-accent" }, c.short), el("span", { class: "color-fg-muted" }, c.session_label),
      el("span", {}, el("div", {}, c.subject.replace(/^bob: /, "")), el("div", { class: "color-fg-muted text-mono" }, c.wrote.join(", ") || "no files")),
      f ? el("span", { class: `Label ${RISK_LABEL[f.risk]}`, title: "flagged by Sentinel before the advisory" }, `Sentinel: ${f.risk}`) : el("span", { class: "color-fg-muted" }, "")); });
    if (t.rollback_commit) rows.push(el("div", { class: "Box-row affected-row f6 color-bg-success" }, el("span", { class: "text-mono color-fg-accent" }, t.rollback_short), el("span"), el("span", {}, "Last clean commit: roll back here and remove the dependency"), el("span")));
    return el("div", {}, el("div", { class: "Box-row" }, el("h3", { class: "f5" }, "Affected components"), el("div", { class: "f6 color-fg-muted" }, `Provenance trace for ${t.needle}: ${t.affected.length} commits, sessions ${t.session_labels.join(", ")}; first read ${fmtT(t.first_read?.at)}`)), ...rows);
  }
  function renderAssessment(inc) {
    const tri = inc.triage, ctx = inc.context || {};
    const srcs = [["advisory", inc.advisory.url, inc.advisory.title], ...(ctx.class_background || []).map((r) => ["class", r.url, r.title]), ...(ctx.cra_guidance || []).map((r) => ["CRA", r.url, r.title])].filter((s) => s[1]);
    return el("div", {},
      el("div", { class: "Box-row" }, el("h3", { class: "f5 mb-2" }, "Assessment ", el("span", { class: "f6 color-fg-muted text-normal" }, tri.model)),
        el("dl", { class: "summary" }, el("dt", {}, "Article 14"), el("dd", {}, `${tri.article_14_applies ? "Applies. " : "Does not apply. "}${tri.article_14_basis}`),
          el("dt", { class: "mt-2" }, "Data at risk"), el("dd", {}, (tri.data_at_risk || []).join(", ") || "–"), el("dt", { class: "mt-2" }, "Summary"), el("dd", {}, tri.summary))),
      srcs.length ? el("div", { class: "Box-row" }, el("h3", { class: "f5 mb-2" }, "Sources read ", el("span", { class: "f6 color-fg-muted text-normal" }, "fetched by Tavily, fed to the drafter")),
        el("ul", { class: "sources list-style-none f6" }, ...srcs.map(([via, url, title]) => el("li", { class: "py-1" }, el("span", { class: "Label mr-2" }, via), el("a", { href: url, target: "_blank", rel: "noopener" }, title || url))))) : null);
  }
  function renderDraft(inc) {
    const d = inc.draft;
    const box = el("div", { class: "Box mb-3" }, el("div", { class: "Box-header d-flex flex-items-center" }, el("h3", { class: "Box-title flex-auto" }, "Early warning draft"), el("span", { class: "f6 color-fg-muted" }, d ? `drafted by ${d.model} in ${d.elapsed_s} s` : "Nemotron Ultra on Nebius Token Factory")));
    if (!d) { box.append(el("div", { class: "Box-body color-fg-muted" }, inc.status === "failed" ? "No draft: the pipeline stopped before Nemotron Ultra ran. Fix the cause above and re-run." : "The draft appears here when Nemotron Ultra has read the advisory, the taint result and the CRA guidance.")); return box; }
    const html = DOMPurify.sanitize(marked.parse(d.text)).replace(/&lt;([^&]{2,140}?)&gt;/g, '<span class="ph">&lt;$1&gt;</span>');
    box.append(el("div", { class: "Box-body markdown-body", html }));
    const foot = el("div", { class: "Box-footer d-flex flex-items-center flex-wrap gutter-condensed" });
    if (inc.status === "review") foot.append(el("button", { class: "btn btn-primary mr-2", type: "button", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/approve`, { by: "compliance lead" }) }, "Approve and file"));
    if (inc.status === "filed") foot.append(el("span", { class: "Label Label--success Label--large mr-2" }, `Approved and filed ${dur(parse(inc.approved_at) - parse(inc.awareness))} after awareness`), el("span", { class: "f6 color-fg-muted mr-3" }, `${inc.approved_by} · ${fmtT(inc.approved_at)}`));
    foot.append(el("button", { class: "btn btn-sm mr-2", type: "button", onclick: (e) => copyDraft(e.target, inc) }, "Copy"), el("a", { class: "btn btn-sm", href: `/api/incidents/${inc.id}/draft.md`, download: `${inc.id}-early-warning.md` }, "Download .md"));
    foot.append(el("span", { class: "f6 color-fg-muted ml-auto" }, inc.status === "review" ? "Approval stops the clock. Nothing is sent: you paste the text into the ENISA reporting platform." : inc.status === "filed" ? "The 72 h notification is the next deadline." : ""));
    box.append(foot);
    return box;
  }
  function renderEmpty() {
    const scanned = state.commits.filter((c) => c.flag).length, flagged = state.commits.filter((c) => c.flag && c.flag.risk !== "none").length;
    const box = el("div", { class: "Box mb-3" },
      el("div", { class: "Box-header d-flex flex-items-center" }, el("div", { class: "flex-auto" }, el("h2", { class: "f3 text-semibold" }, "Pre-incident checks"), el("div", { class: "f6 color-fg-muted" }, "Sentinel register and advisory watch, before any incident")), el("span", { class: "State State--draft" }, "No open incident")),
      el("div", { class: "Box-body" }, summary([["Monitor", state.config.tavily ? `${state.watchlist.length} dependencies watched` : "Tavily not configured", `every ${Math.round(state.config.interval_s / 60)} min`], ["Sentinel coverage", `${scanned} of ${state.commits.length} agent commits scanned`], ["Risk flags", flagged ? `${flagged} flagged before any advisory` : "none"]])),
      el("div", { class: "Box-row" }, el("h3", { class: "f5 mb-2" }, "How an incident is handled"), renderTimeline(null)));
    const c = state.commits.find((x) => x.sha === selectedCommit);
    if (c) box.append(renderCommitDetail(c)); else box.append(el("div", { class: "Box-row f6 color-fg-muted" }, "Select a commit in the Sentinel register to see what the agent read and wrote and why it was flagged. An incident record replaces this document when an advisory matches a watched dependency."));
    return box;
  }
  function renderCommitDetail(c) {
    const f = c.flag;
    const root = el("div", { class: "Box-row" }, el("h3", { class: "f5 mb-2" }, `Commit ${c.short} · session ${c.session_label}`), el("div", { class: "f6 color-fg-muted mb-2" }, c.subject),
      el("dl", { class: "summary" },
        el("dt", {}, "Read"), el("dd", { class: "f6 text-mono" }, c.read.join(", ") || "–"),
        el("dt", { class: "mt-2" }, "Wrote"), el("dd", { class: "f6 text-mono" }, c.wrote.join(", ") || "–"),
        el("dt", { class: "mt-2" }, "Record"), el("dd", { class: "f6 text-mono color-fg-muted" }, `sha256 ${c.record_sha256 || "–"}`),
        el("dt", { class: "mt-2" }, "Sentinel"), f ? el("dd", {}, el("span", { class: `Label ${RISK_LABEL[f.risk]} mr-1` }, f.risk), (f.classes || []).join(", "), f.cwe?.length ? ` · ${f.cwe.join(", ")}` : "", el("div", { class: "f6 color-fg-muted" }, `${f.model ? "classified by " + f.model : "pattern scan only"} · scanned ${fmtT(f.scanned_at)}`), el("div", { class: "mt-1" }, f.summary), f.cra_relevance ? el("div", { class: "f6 color-fg-muted mt-1" }, f.cra_relevance) : null) : el("dd", {}, "not scanned yet")));
    if (f) root.append(el("ul", { class: "list-style-none mt-2" }, ...[...new Set([...(f.evidence || []), ...(f.findings || []).map((x) => `${x.source}: ${x.title} — ${x.evidence}`)])].map((e) => el("li", { class: "f6 text-mono color-bg-subtle rounded-2 p-2 mb-1", style: "white-space:pre-wrap;overflow-wrap:anywhere" }, e))));
    api(`/api/commits/${c.sha}`).then((d) => root.append(el("pre", { class: "f6 mt-2 p-2 rounded-2 color-bg-subtle", style: "max-height:360px;overflow:auto", html: d.diff.split("\n").map((l) => `<span class="${l.startsWith("+") ? "color-fg-success" : l.startsWith("-") ? "color-fg-danger" : l.startsWith("@@") ? "color-fg-accent" : ""}">${l.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]))}</span>`).join("\n") }))).catch(() => {});
    return root;
  }
  function renderLedger() {
    const calls = state.calls.slice().reverse(), nebius = state.calls.filter((c) => c.provider === "nebius"), tav = state.calls.filter((c) => c.provider === "tavily");
    const tokens = nebius.reduce((a, c) => a + (c.prompt_tokens || 0) + (c.completion_tokens || 0), 0);
    return el("details", { class: "details-reset Box mb-3" },
      el("summary", { class: "Box-header d-flex flex-items-center", style: "cursor:pointer" }, el("span", { class: "Box-title flex-auto" }, "Run ledger"), el("span", { class: "f6 color-fg-muted" }, `${nebius.length} Nemotron calls · ${tokens.toLocaleString()} tokens · ${tav.length} Tavily calls`)),
      ...calls.map((c) => el("div", { class: "Box-row ledger-row f6" }, el("span", { class: "text-mono color-fg-muted" }, hhmm(c.at)), el("span", {}, c.provider === "nebius" ? "Token Factory" : "Tavily", c.fixture ? el("span", { class: "Label Label--attention ml-1" }, "fixture") : null),
        el("span", { class: "text-mono" }, c.op, c.model ? ` · ${c.model}` : ""), el("span", { class: "text-mono color-fg-muted" }, c.prompt_tokens != null ? `${c.prompt_tokens} + ${c.completion_tokens} tok` : c.error ? "error" : c.results != null ? `${c.results} results` : ""), el("span", { class: "text-mono color-fg-muted" }, `${c.elapsed_s} s`))));
  }

  // ------------------------------------------------------------------ clock
  function startClock(inc) {
    clearInterval(clockTimer);
    const node = $("#clock"), band = $("#band-clock"), bt = $(".bc-time", band), live = currentIncident();
    band.hidden = !live;
    if (live) $(".bc-no", band).textContent = incNo(live);
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
