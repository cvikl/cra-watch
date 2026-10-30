/* CRA Watch console. Renders from /api/state; re-renders on every server-sent event. */
(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const k of kids.flat()) if (k != null) n.append(k.nodeType ? k : document.createTextNode(String(k)));
    return n;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtT = (iso) => iso ? iso.replace("T", " ").replace("Z", " UTC") : "–";
  const hhmm = (iso) => iso ? iso.slice(11, 19) : "–";
  const pad = (n) => String(n).padStart(2, "0");
  const dur = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`; };
  const parse = (iso) => Date.parse(iso);

  const STEPS = [
    ["detect", "Detect", "Tavily feed"], ["trace", "Trace", "Origit taint"], ["read", "Read", "Tavily extract"],
    ["triage", "Triage", "Nemotron Nano"], ["context", "Context", "Tavily search"], ["draft", "Draft", "Nemotron Ultra"], ["review", "Review", "You"],
  ];
  const STATUS_ORDER = ["detected", "trace", "read", "triage", "context", "draft", "review", "filed"];

  let state = null, selectedIncident = null, selectedCommit = null, clockTimer = null, watchOpen = false;
  const incNo = (inc) => inc.id.replace("inc_", "INC-").toUpperCase();
  const check = () => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 16 16"); s.setAttribute("aria-label", "done"); s.innerHTML = '<path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/>'; return s; };

  // ------------------------------------------------------------------ data
  async function api(path, opts = {}) {
    const r = await fetch(path, { headers: { "Content-Type": "application/json", "X-CRAWatch-Token": localStorage.getItem("crawatch_token") || "" }, ...opts });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body.detail || body.error || r.statusText);
    return body;
  }
  async function refresh() {
    state = await api("/api/state");
    render();
  }
  let pending = false;
  function scheduleRefresh() {
    if (pending) return; pending = true;
    setTimeout(() => { pending = false; refresh().catch(console.error); }, 150);
  }

  // ------------------------------------------------------------------ band
  function renderBand() {
    $("#manufacturer").textContent = state.manufacturer;
    $("#product").textContent = state.product;
    const c = state.config, n = state.commits.length;
    const items = [
      ["Nebius Token Factory", c.nebius, c.fake_llm ? "fixture mode" : (c.nebius ? "connected" : "no key"), null],
      ["Nemotron Nano", c.nebius, null, c.nano], ["Nemotron Ultra", c.nebius, null, c.ultra],
      ["Tavily", c.tavily, c.tavily ? null : "no key", null], ["Origit", true, `${n} commits`, "agent commits with Origit records"],
    ];
    $("#systems").replaceChildren(...items.map(([name, on, id, title]) => el("li", { class: on ? "on" : "off", title: title || id || name }, el("span", { class: "dot" }), name, id ? el("span", { class: "sys-id" }, id) : null)));
  }

  // ------------------------------------------------------------------ register
  function renderWatchlist() {
    const list = $("#watchlist");
    const shown = watchOpen ? state.watchlist : state.watchlist.slice(0, 4);
    list.replaceChildren(...shown.map((d) => el("li", {},
      el("span", { class: "dep" }, d.name, " ", el("span", { class: "ver" }, d.version ? `@${d.version}` : "")),
      el("span", { class: d.last_result && /^(CVE|GHSA)/.test(d.last_result) ? "hit num" : "num", title: "last poll result" }, d.last_result || "not polled"),
      el("span", { class: "meta" }, el("span", {}, d.added_in ? `added in ${d.added_in}` : "manual"), el("span", {}, d.bulletins?.length ? `${d.bulletins.length} bulletin feed${d.bulletins.length > 1 ? "s" : ""}` : "advisory search"), d.last_checked ? el("span", {}, `polled ${hhmm(d.last_checked)}`) : null),
    )));
    if (state.watchlist.length > 4) list.append(el("li", { style: "display:block;border:0;padding:.2rem 0 0" }, el("button", { class: "watch-more", onclick: () => { watchOpen = !watchOpen; render(); } }, watchOpen ? "Show fewer" : `Show all ${state.watchlist.length} watched`)));
    $("#monitor-note").textContent = `Polls NVD, GitHub Advisories, OSV and vendor bulletins through Tavily every ${Math.round(state.config.interval_s / 60)} min on a Nebius Serverless Job.`;
    const b = $("#btn-monitor"); b.classList.toggle("busy", !!state.jobs.monitor); b.disabled = !state.config.tavily;
    b.title = state.config.tavily ? "Poll the advisory feeds through Tavily now" : "Needs TAVILY_API_KEY";
  }
  function renderCommits() {
    const list = $("#commits");
    const flagged = state.commits.filter((c) => c.flag && c.flag.risk !== "none").length;
    const scanned = state.commits.filter((c) => c.flag).length;
    $("#sentinel-note").textContent = scanned ? `${scanned} of ${state.commits.length} agent commits scanned, ${flagged} flagged before any advisory.` : "Not scanned yet. Sentinel reads what each agent read and wrote, scans for vulnerability-class patterns, and Nemotron Nano classifies.";
    list.replaceChildren(...state.commits.map((c) => {
      const risk = c.flag ? c.flag.risk : "unscanned";
      return el("li", { tabindex: 0, role: "button", "aria-current": selectedCommit === c.sha ? "true" : null, title: `${c.subject} (${risk})`,
        onclick: () => { selectedCommit = c.sha; selectedIncident = null; render(); }, onkeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectedCommit = c.sha; selectedIncident = null; render(); } } },
        el("span", {}, el("span", { class: "sha" }, c.short), el("span", { class: "ses" }, c.session_label)),
        el("span", { class: "subj" }, c.subject.replace(/^bob: /, "")),
        el("span", { class: "scale", "data-risk": risk, "aria-label": `risk ${risk}` }, el("i"), el("i"), el("i"), el("i")),
      );
    }));
    const b = $("#btn-sentinel"); b.classList.toggle("busy", !!state.jobs.sentinel); b.disabled = !state.config.nebius;
    b.title = state.config.nebius ? "Scan every agent commit in the Origit store with Nemotron Nano" : "Needs NEBIUS_API_KEY";
    if (!state.config.nebius && !scanned) $("#sentinel-note").textContent += " Add a Nebius Token Factory key to run the scan.";
  }
  function renderJournal() {
    const evs = state.events.slice(-14).reverse();
    $("#journal").replaceChildren(...evs.map((e) => el("li", { class: e.kind }, el("time", {}, hhmm(e.at)), el("span", {}, el("span", { class: "k" }, e.kind), e.text))));
  }

  // ------------------------------------------------------------------ report
  function currentIncident() {
    if (!state.incidents.length) return null;
    return state.incidents.find((i) => i.id === selectedIncident) || state.incidents[0];
  }
  function render() {
    renderBand(); renderWatchlist(); renderCommits(); renderJournal();
    const report = $("#report");
    const inc = selectedCommit ? null : currentIncident();
    report.replaceChildren();
    if (state.incidents.length > 1 && !selectedCommit) report.append(renderTabs());
    if (inc) report.append(renderIncident(inc));
    else report.append(renderEmpty());
    report.append(renderLedger());
    startClock(inc);
  }
  function renderTabs() {
    return el("div", { class: "incident-tabs", role: "tablist" }, ...state.incidents.map((i) => el("button", { role: "tab", "aria-selected": String(currentIncident().id === i.id), onclick: () => { selectedIncident = i.id; selectedCommit = null; render(); } }, `${i.dependency} · ${i.advisory.advisory_id || "advisory"} · ${i.status}`)));
  }

  function stepStatus(inc, key) {
    const idx = STATUS_ORDER.indexOf(key === "detect" ? "detected" : key);
    const cur = STATUS_ORDER.indexOf(inc.status);
    if (inc.status === "failed") { const last = inc.steps.length ? STATUS_ORDER.indexOf(inc.steps[inc.steps.length - 1].name) : 0; return idx <= last ? "done" : (idx === last + 1 ? "failed" : "pending"); }
    if (key === "review") return inc.status === "filed" ? "done" : (inc.status === "review" ? "running" : "pending");
    if (idx < cur || inc.status === "filed") return "done";
    if (idx === cur) return key === "detect" ? "done" : "done";
    if (idx === cur + 1 && inc.status !== "review") return "running";
    return "pending";
  }
  function renderLadder(inc) {
    return el("ol", { class: "ladder" }, ...STEPS.map(([key, name, actor], n) => {
      const st = inc ? stepStatus(inc, key) : "pending";
      const rec = inc && (key === "detect" ? { at: inc.opened_at, text: `${inc.advisory.advisory_id || "Advisory"} via ${inc.source} feed` } : inc.steps.find((s) => s.name === key));
      const text = key === "review" && inc ? (inc.status === "filed" ? `Approved by ${inc.approved_by}` : inc.status === "review" ? "Awaiting your approval" : "") : (st === "failed" ? "Stopped here, see the error below" : rec?.text);
      return el("li", { class: `step ${st}` }, el("span", { class: "st-no" }, `STEP ${n + 1}`), el("span", { class: "st-name" }, name, st === "done" ? check() : null), el("span", { class: "st-actor" }, actor),
        text ? el("p", { class: "st-text" }, text) : null, rec?.at ? el("span", { class: "st-time" }, hhmm(rec.at)) : null);
    }));
  }

  function renderIncident(inc) {
    const tri = inc.triage, t = inc.taint, adv = inc.advisory;
    const stampClass = inc.status === "filed" ? "stamp-ok" : inc.status === "failed" ? "stamp-fail" : inc.status === "review" ? "stamp-live" : "";
    const stampText = { detected: "Detected", trace: "Tracing", read: "Reading", triage: "Triage", context: "Context", draft: "Drafting", review: "Awaiting approval", filed: "Filed", failed: "Pipeline failed" }[inc.status] || inc.status;
    const doc = el("article", { class: "doc" },
      el("header", { class: "doc-head" },
        el("div", { class: "doc-no" }, el("h1", { class: "value" }, incNo(inc)), el("span", { class: "sub" }, `Incident record · opened ${fmtT(inc.opened_at)} · early warning under CRA Art. 14(4)(a)`)),
        el("div", { class: "doc-status" }, el("span", { class: `stamp ${stampClass}` }, stampText))),
      el("section", { class: "fields" },
        field("Dependency", `${inc.dependency}${inc.version ? "@" + inc.version : ""}`, "npm, introduced by an agent"),
        field("Advisory", adv.url ? el("a", { href: adv.url, target: "_blank", rel: "noopener" }, adv.advisory_id || "source") : (adv.advisory_id || "–"), adv.title),
        field("Severity", tri ? el("span", { class: `sev sev-${tri.severity}` }, tri.severity, tri.cvss ? ` · ${tri.cvss}` : "") : inc.status === "failed" ? "not assessed" : el("span", { class: "skeleton w60" }), tri ? tri.vulnerability_class : inc.status === "failed" ? "pipeline stopped before triage" : "Nemotron Nano pending"),
        field("Awareness", fmtT(inc.awareness), "clock starts here"),
        el("div", { class: "field field-clock" }, el("span", { class: "label" }, inc.status === "filed" ? "Filed after" : "Early warning due in"), el("span", { class: "clock", id: "clock" }, "–"), el("span", { class: "sub num" }, `24 h: ${fmtT(inc.deadlines.early_warning_24h)} · 72 h: ${fmtT(inc.deadlines.notification_72h)} · final: ${inc.deadlines.final_report_1m.slice(0, 10)}`)),
      ),
      el("section", { class: "doc-section" }, el("h2", { class: "sec-title" }, el("span", { class: "sec-no" }, "1"), "Pipeline", el("span", { class: "sec-hint" }, "seven steps, each signed by the system that did it")), renderLadder(inc)),
      inc.error ? el("div", { class: "notice" }, el("span", {}, inc.error), el("button", { class: "btn", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/rerun`) }, "Re-run pipeline")) : null,
      t ? renderTaint(inc) : null,
      tri ? renderTriage(inc) : null,
      renderDraft(inc),
    );
    return doc;
  }
  function field(label, value, sub) {
    return el("div", { class: "field" }, el("span", { class: "label" }, label), el("span", { class: "value" }, value), sub ? el("span", { class: "sub" }, sub) : null);
  }
  function renderTaint(inc) {
    const t = inc.taint, flags = Object.fromEntries((inc.prior_flags || []).map((f) => [f.short, f]));
    const rows = t.affected.map((c) => {
      const f = flags[c.short];
      return el("tr", {}, el("td", { class: "mono" }, c.short), el("td", {}, c.session_label), el("td", {}, c.subject.replace(/^bob: /, "")),
        el("td", { class: "files" }, c.wrote.join(", ") || "–"), el("td", {}, c.approver ? "approver" : "–"),
        el("td", {}, f ? el("span", { class: `sev sev-${f.risk}` }, f.risk) : el("span", { class: "files" }, "none")));
    });
    if (t.rollback_commit) rows.push(el("tr", { class: "rollback" }, el("td", { class: "mono" }, t.rollback_short), el("td", {}, "–"), el("td", { colspan: 4 }, "Last clean commit: roll back here and remove the dependency")));
    return el("section", { class: "doc-section" },
      el("h2", { class: "sec-title" }, el("span", { class: "sec-no" }, "2"), "Affected components", el("span", { class: "sec-hint" }, `Origit taint for ${t.needle}: ${t.affected.length} commits, sessions ${t.session_labels.join(", ")}; first read ${fmtT(t.first_read?.at)}`, el("span", { class: "scroll-hint" }, " · scroll sideways for files and flags"))),
      el("div", { class: "tbl-x" }, el("table", { class: "tbl" }, el("thead", {}, el("tr", {}, ...["Commit", "Session", "Agent run", "Files written", "Approved by", "Sentinel flag"].map((h) => el("th", {}, h)))), el("tbody", {}, ...rows))));
  }
  function renderTriage(inc) {
    const tri = inc.triage, ctx = inc.context || {};
    const srcs = [["advisory", inc.advisory.url, inc.advisory.title], ...(ctx.class_background || []).map((r) => ["class", r.url, r.title]), ...(ctx.cra_guidance || []).map((r) => ["CRA", r.url, r.title])].filter((s) => s[1]);
    return el("section", { class: "doc-section" },
      el("h2", { class: "sec-title" }, el("span", { class: "sec-no" }, "3"), "Assessment", el("span", { class: "sec-hint" }, `${tri.model}`)),
      el("div", { class: "flag-grid" },
        el("span", { class: "label" }, "Article 14"), el("span", {}, tri.article_14_applies ? "Applies. " : "Does not apply. ", tri.article_14_basis),
        el("span", { class: "label" }, "Data at risk"), el("span", {}, (tri.data_at_risk || []).join(", ") || "–"),
        el("span", { class: "label" }, "Malicious or exploited"), el("span", {}, tri.exploited_or_malicious ? "Yes" : "Not stated"),
        el("span", { class: "label" }, "Summary"), el("span", {}, tri.summary)),
      srcs.length ? el("h2", { class: "sec-title", style: "margin-top:1.2rem" }, el("span", { class: "sec-no" }, "4"), "Sources read", el("span", { class: "sec-hint" }, "fetched by Tavily, fed to the drafter")) : null,
      srcs.length ? el("ul", { class: "sources" }, ...srcs.map(([via, url, title]) => el("li", {}, el("span", { class: "via" }, via), el("a", { href: url, target: "_blank", rel: "noopener" }, title || url)))) : null);
  }
  function renderDraft(inc) {
    const d = inc.draft;
    const sec = el("section", { class: "doc-section" }, el("h2", { class: "sec-title" }, el("span", { class: "sec-no" }, inc.triage ? "5" : "2"), "Early warning draft", el("span", { class: "sec-hint" }, d ? `drafted by ${d.model}` : "Nemotron Ultra on Nebius Token Factory")));
    if (!d) {
      const waiting = inc.status !== "failed";
      sec.append(el("div", { class: "sheet sheet-empty" }, ...(waiting ? [el("div", { class: "skeleton w40" }), el("div", { class: "skeleton" }), el("div", { class: "skeleton w80" }), el("div", { class: "skeleton" }), el("div", { class: "skeleton w60" })] : []),
        el("p", { class: "callout" }, waiting ? "The draft appears here when Nemotron Ultra has read the advisory, the taint result and the CRA guidance." : "No draft: the pipeline stopped before Nemotron Ultra ran. Fix the cause named above and re-run the pipeline.")));
      return sec;
    }
    const sheet = el("div", { class: inc.status === "filed" ? "sheet stamped" : "sheet" }, el("div", { class: "prose", html: md(d.text) }));
    if (inc.status === "filed") {
      const ms = parse(inc.approved_at) - parse(inc.awareness);
      sheet.prepend(el("div", { class: "stamp-big", "aria-label": "approved and filed" }, "Approved · Filed", el("small", {}, `${dur(ms)} after awareness`)));
    }
    sheet.append(el("div", { class: "sig" },
      el("div", {}, el("span", { class: "label" }, "Drafted by"), el("span", { class: "value" }, d.model), el("span", { class: "draft-meta" }, `${d.elapsed_s} s`, d.prompt_tokens ? `${d.prompt_tokens.toLocaleString()} prompt tokens` : null, d.completion_tokens ? `${d.completion_tokens.toLocaleString()} completion tokens` : null)),
      el("div", {}, el("span", { class: "label" }, "Reviewed and approved by"), el("div", { class: "line" }, inc.status === "filed" ? `${inc.approved_by} · ${fmtT(inc.approved_at)}` : "")),
      el("div", { class: "sig-actions" },
        inc.status === "review" ? el("button", { class: "btn btn-primary", onclick: (e) => act(e.target, `/api/incidents/${inc.id}/approve`, { by: "compliance lead" }) }, "Approve and file") : null,
        el("button", { class: "btn", onclick: (e) => copyDraft(e.target, inc) }, "Copy notification"),
        el("a", { class: "btn", href: `/api/incidents/${inc.id}/draft.md`, download: `${inc.id}-early-warning.md` }, "Download .md"),
        el("span", { class: "hint" }, inc.status === "review" ? "Approval stops the clock. Nothing is sent: the text is copied into the ENISA reporting platform by you." : inc.status === "filed" ? "Filed. The 72 h notification is the next deadline." : ""))));
    sec.append(sheet);
    return sec;
  }

  function renderEmpty() {
    const t = $("#tpl-empty").content.cloneNode(true);
    const scanned = state.commits.filter((c) => c.flag).length, flagged = state.commits.filter((c) => c.flag && c.flag.risk !== "none").length;
    t.querySelector('[data-k="monitor"]').textContent = state.config.tavily ? `${state.watchlist.length} dependencies watched, every ${Math.round(state.config.interval_s / 60)} min` : "Tavily not configured";
    t.querySelector('[data-k="coverage"]').textContent = `${scanned} of ${state.commits.length} agent commits scanned`;
    t.querySelector('[data-k="flags"]').textContent = flagged ? `${flagged} flagged (pre-incident)` : "none";
    t.querySelector('[data-k="ladder"]').replaceWith(renderLadder(null));
    const detail = t.querySelector('[data-k="commit-detail"]');
    const c = state.commits.find((x) => x.sha === selectedCommit);
    if (c) renderCommitDetail(detail, c); else detail.append(el("p", { class: "callout" }, "Select a commit in the Sentinel register to see what the agent read and wrote and why it was flagged. An incident record replaces this document when an advisory matches a watched dependency."));
    return t;
  }
  async function renderCommitDetail(root, c) {
    const f = c.flag;
    root.append(el("h2", { class: "sec-title" }, el("span", { class: "sec-no" }, "2"), `Commit ${c.short} · session ${c.session_label}`, el("span", { class: "sec-hint" }, c.subject)));
    const grid = el("div", { class: "flag-grid" },
      el("span", { class: "label" }, "Read"), el("span", {}, c.read.join(", ") || "–"),
      el("span", { class: "label" }, "Wrote"), el("span", {}, c.wrote.join(", ") || "–"),
      el("span", { class: "label" }, "Added"), el("span", {}, c.added_deps.join(", ") || "–"),
      el("span", { class: "label" }, "Record"), el("span", { class: "mono" }, `sha256 ${c.record_sha256 || "–"}`));
    if (f) grid.append(
      el("span", { class: "label" }, "Sentinel"), el("span", {}, el("span", { class: `sev sev-${f.risk}` }, f.risk), " ", (f.classes || []).join(", "), f.cwe?.length ? ` · ${f.cwe.join(", ")}` : "", el("span", { class: "draft-meta" }, el("span", {}, f.model ? `classified by ${f.model}` : "pattern scan only"), el("span", {}, `scanned ${fmtT(f.scanned_at)}`))),
      el("span", { class: "label" }, "Summary"), el("span", {}, f.summary),
      el("span", { class: "label" }, "CRA relevance"), el("span", {}, f.cra_relevance || "–"),
      el("span", { class: "label" }, "Evidence"), el("ul", { class: "evid" }, ...[...new Set([...(f.evidence || []), ...(f.findings || []).map((x) => `${x.source}: ${x.title} — ${x.evidence}`)])].map((e) => el("li", {}, e))));
    else grid.append(el("span", { class: "label" }, "Sentinel"), el("span", {}, "not scanned yet"));
    root.append(grid);
    try {
      const d = await api(`/api/commits/${c.sha}`);
      root.append(el("pre", { class: "diff", html: d.diff.split("\n").map((l) => `<span class="${l.startsWith("+") ? "add" : l.startsWith("-") ? "del" : l.startsWith("@@") ? "hunk" : ""}">${esc(l)}</span>`).join("\n") }));
    } catch (e) { root.append(el("p", { class: "callout" }, `Diff unavailable: ${e.message}`)); }
  }

  function renderLedger() {
    const calls = state.calls.slice().reverse();
    const nebius = state.calls.filter((c) => c.provider === "nebius"), tav = state.calls.filter((c) => c.provider === "tavily");
    const tokens = nebius.reduce((a, c) => a + (c.prompt_tokens || 0) + (c.completion_tokens || 0), 0);
    const d = el("details", { class: "ledger" }, el("summary", {}, el("span", {}, "Run ledger"), el("span", { class: "num" }, `${nebius.length} Nemotron calls · ${tokens.toLocaleString()} tokens · ${tav.length} Tavily calls`)));
    d.append(el("div", { class: "tbl-wrap" }, el("table", { class: "tbl" }, el("thead", {}, el("tr", {}, ...["Time", "System", "Operation", "Model", "Tokens", "Elapsed", "Detail"].map((h) => el("th", {}, h)))),
      el("tbody", {}, ...calls.map((c) => el("tr", {}, el("td", { class: "num" }, hhmm(c.at)), el("td", {}, c.provider === "nebius" ? "Nebius Token Factory" : "Tavily"), el("td", {}, c.op, c.fixture ? el("span", { class: "fixture" }, " FIXTURE") : null),
        el("td", { class: "mono" }, c.model || "–"), el("td", { class: "num" }, c.prompt_tokens != null ? `${c.prompt_tokens} + ${c.completion_tokens}` : "–"), el("td", { class: "num" }, `${c.elapsed_s} s`),
        el("td", { class: "files" }, c.error ? `error: ${c.error}` : c.query || (c.urls ? c.urls.slice(0, 2).join(", ") : "") || (c.results != null ? `${c.results} results` : ""))))))));
    return d;
  }

  // ------------------------------------------------------------------ clock
  function startClock(inc) {
    clearInterval(clockTimer);
    const node = $("#clock"), band = $("#band-clock"), bt = $(".bc-time", band);
    const live = currentIncident();
    if (!live) { band.hidden = true; if (!node) return; }
    else { band.hidden = false; $(".bc-no", band).textContent = incNo(live); $(".bc-label", band).textContent = live.status === "filed" ? "filed after" : "early warning due in"; }
    const target = inc || live; if (!target) return;
    const due = parse(target.deadlines.early_warning_24h);
    const tick = () => {
      let text, cls;
      if (target.status === "filed") { text = dur(parse(target.approved_at) - parse(target.awareness)); cls = "stopped"; }
      else { const left = due - Date.now(); text = (left < 0 ? "-" : "") + dur(Math.abs(left)); cls = left < 0 ? "over" : ""; }
      for (const n of [node, bt]) { if (!n) continue; n.textContent = text; n.classList.toggle("stopped", cls === "stopped"); n.classList.toggle("over", cls === "over"); }
    };
    tick(); clockTimer = setInterval(tick, 1000);
  }

  // ------------------------------------------------------------------ actions
  async function act(btn, path, body) {
    btn.classList.add("busy"); btn.disabled = true;
    try { await api(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }); await refresh(); }
    catch (e) { alert(e.message); btn.classList.remove("busy"); btn.disabled = false; }
  }
  async function copyDraft(btn, inc) {
    try { await navigator.clipboard.writeText(inc.draft.text); btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy notification"), 1500); }
    catch { window.open(`/api/incidents/${inc.id}/draft.md`, "_blank"); }
  }
  $("#btn-monitor").addEventListener("click", (e) => act(e.target, "/api/monitor/run"));
  $("#btn-sentinel").addEventListener("click", (e) => act(e.target, "/api/sentinel/run"));

  // ------------------------------------------------------------------ markdown (headings, lists, bold, code, placeholders)
  function md(src) {
    const lines = src.split("\n"); let out = "", list = null;
    const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/&lt;([^&]{2,60}?)&gt;/g, '<span class="ph">&lt;$1&gt;</span>');
    const close = () => { if (list) { out += `</${list}>`; list = null; } };
    for (const raw of lines) {
      const l = raw.trimEnd();
      let m;
      if ((m = l.match(/^(#{1,3})\s+(.*)/))) { close(); out += `<h${m[1].length + 1}>${inline(m[2])}</h${m[1].length + 1}>`; }
      else if ((m = l.match(/^\s*[-*]\s+(.*)/))) { if (list !== "ul") { close(); out += "<ul>"; list = "ul"; } out += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== "ol") { close(); out += "<ol>"; list = "ol"; } out += `<li>${inline(m[1])}</li>`; }
      else if (!l.trim()) close();
      else { close(); out += `<p>${inline(l)}</p>`; }
    }
    close(); return out;
  }

  // ------------------------------------------------------------------ live
  function connect() {
    const es = new EventSource("/api/events");
    es.onopen = () => $("#live-dot").classList.add("on");
    es.onerror = () => $("#live-dot").classList.remove("on");
    es.onmessage = scheduleRefresh;
  }
  refresh().then(connect).catch((e) => { $("#report").textContent = `Cannot load state: ${e.message}`; });
})();
