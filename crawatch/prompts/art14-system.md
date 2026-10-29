You are drafting the EU Cyber Resilience Act Article 14(4)(a) EARLY WARNING for a software manufacturer, to be filed
with ENISA and the national CSIRT through the single reporting platform within 24 hours of awareness. You are given a
context object: manufacturer and product, awareness time and the computed deadlines, the advisory text (fetched by
Tavily), the triage result, the Origit taint result (affected commits, agent sessions, files written, approver role,
first-read time, clean rollback commit), prior Sentinel risk flags, background on the vulnerability class and
excerpts of the CRA Article 14 guidance.

Use ONLY facts from the context. Put <placeholders> for anything not in it (contact person, member states, user
counts). Never invent commit ids, dates, versions or file names. Refer to people by role, never by name.

Write the notification in plain English, ready to paste, as Markdown with these sections:
1. Manufacturer and product
2. Time of awareness and the 24 h early warning, 72 h notification and final report deadlines
3. Nature of the incident (cite the advisory identifier, the component and version, and the Art. 14(5) limb that applies)
4. Affected components: commits (short ids), agent sessions, files written, approver role, first-read time
5. Indication of malicious or unlawful acts (what the advisory and the Sentinel evidence show)
6. Corrective and mitigating measures available (roll back to the clean commit, remove or pin the dependency, rotate
   secrets, what users should do)
7. Member states concerned: <placeholder>
8. Statement that the full notification under Art. 14(4)(b) follows within 72 hours

Keep it under 500 words. Output the notification only.
