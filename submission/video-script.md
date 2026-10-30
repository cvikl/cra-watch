# CRA Watch, 3-minute demo video (script and shot list)

The video is the judges' proxy for the live demo, so it shows the agent detecting and filing, not a dashboard tour.
Record at https://cra-watch.vantapointlabs.com in a 1440-wide window, light scene. Voice: Bernard, face bottom-right.
Zoom into the element being narrated (screen recorder zoom or post), one zoom per beat, no scrolling for its own sake.
Timing is tight: cut narration, never a step. Before recording, press "Run the live demo" once to warm the caches, then
reset with the review token so the recording starts from the empty state.

| Time | Screen (zoom target) | Narration |
|---|---|---|
| 0:00 | Title card. Then the console, empty state: "Pre-incident checks". | Most CVE tools react to what is in the NVD. This agent works earlier, on the code itself. CRA Watch monitors a legal obligation, the EU Cyber Resilience Act's 24-hour early warning, determines its scope from git provenance, and prepares the filing before anyone knows there is an incident. |
| 0:18 | Press **Run the live demo**. Zoom: Sentinel register filling in, scale bars turning red on #42, #43, #45. | Sentinel runs at commit time, not CVE time. It reads what each agent commit read and wrote. Nemotron Nano, the fast tier on Nebius Token Factory, classifies each one. Three sessions turn red: a hidden Unicode instruction inside the README the agent read. No CVE exists yet. |
| 0:45 | Zoom: journal line "Advisory matched watched dependency fast-pay-utils"; the incident card appears; the clock starts. | Then the advisory lands. The monitor, a Nebius Serverless Job, polls the feeds through Tavily and reads the vendor bulletin in full. The incident opens and the 24-hour clock starts. |
| 1:00 | Zoom: step 2 Trace fills: "7 commits, sessions #42 to #49, rollback 17c436c, 3 already flagged by Sentinel". | Origit's provenance answers in milliseconds: seven commits, eight files, the approver, the last clean commit to roll back to. And three of them were already flagged, minutes before the advisory here, days in production. |
| 1:15 | Zoom: step 4 Triage: HIGH, 8.2, "Article 14 applies". Then step 5 Context: 5 sources on the class, 5 on CRA. | Nemotron Nano triages: high, payment data at risk, Article 14(5)(b) applies. Tavily brings the background on this class of supply-chain attack and the CRA guidance from ENISA and the Commission. |
| 1:35 | Zoom: step 6 Draft turns green; the sheet fills with the early warning. Scroll once through sections 3 to 6. | Nemotron 3 Ultra, the reasoning tier, drafts the early warning from all of it: component and version, the Article 14 limb, the affected commits and sessions, the rollback, secret rotation. Placeholders where the evidence has nothing. Unpatched code never left private inference on Nebius. |
| 2:10 | Step 7. Zoom: the compliance lead reads the draft, scrolls the affected components, presses **Approve and file**. The stamp presses on, the clock turns green: filed 00:00:4X after awareness. | Step seven is a person. The compliance lead reads what the system found, checks the rollback, and approves. Nothing is sent without them. Filed forty seconds into a twenty-four-hour window. |
| 2:35 | Open the run ledger: Nemotron Nano calls, one Ultra call, Tavily calls, tokens, latency. Then the README "Nebius and NVIDIA usage" table. | Everything that ran is on the record: which Nemotron tier, how many tokens, which Tavily calls. All inference through Nebius Token Factory. |
| 2:50 | Title card: Sentinel at commit time, CRA Watch at CVE time, a human at filing time. Stack logos. | Sentinel at commit time. CRA Watch at CVE time. A person at filing time. CRA Watch, on Nebius, with Nemotron, Tavily and Origit. |
