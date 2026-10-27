// Paper-style samples of a real kind of bill and the letter we write for it.
// Names and numbers are made up, and every sample is labeled as one.

const BILL_LINES: { line: number; date: string; code: string; desc: string; amt: string; flag?: string }[] = [
  { line: 11, date: "03/02", code: "99285", desc: "ER visit, level 5", amt: "1,198.00" },
  { line: 12, date: "03/02", code: "36415", desc: "Blood draw", amt: "42.00" },
  { line: 13, date: "03/02", code: "80053", desc: "Metabolic panel", amt: "156.00" },
  { line: 14, date: "03/02", code: "74177", desc: "CT abdomen/pelvis w/ contrast", amt: "1,240.00" },
  { line: 15, date: "03/02", code: "74177", desc: "CT abdomen/pelvis w/ contrast", amt: "1,240.00", flag: "Same scan, same day. Billed twice." },
  { line: 16, date: "03/02", code: "99284", desc: "ER physician (Lakeside Emergency Group, out of network)", amt: "522.00", flag: "Out-of-network doctor at an in-network ER. Federal law limits you to your in-network share." },
];

export function SampleBill({ compact = false }: { compact?: boolean }) {
  return (
    <figure className="paper" style={{ margin: 0 }} aria-label="Sample hospital bill with two problems marked">
      <div className="paper-head">
        <span>
          <strong>Riverside Medical Center</strong>
          <br />Patient Billing · Statement date 03/18
        </span>
        <span style={{ textAlign: "right" }}>
          Account 44821
          <br />Amount due <strong>$4,180.00</strong>
        </span>
      </div>
      <table className="paper-table bill">
        <thead>
          <tr><th>Line</th><th>Date</th><th>Code</th><th>Description</th><th style={{ textAlign: "right" }}>Charge</th></tr>
        </thead>
        <tbody>
          {(compact ? BILL_LINES.slice(2) : BILL_LINES).map((l) => (
            <tr key={l.line} className={l.flag ? "flagged" : undefined}>
              <td>{l.line}</td><td>{l.date}</td><td>{l.code}</td>
              <td>
                {l.desc}
                {l.flag && <span className="paper-note">{l.flag}</span>}
              </td>
              <td style={{ textAlign: "right" }}>{l.amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="paper-foot">Sample bill. The hospital, account and charges are made up. The two problems marked are the kind we find most.</figcaption>
    </figure>
  );
}

export function SampleLetter() {
  return (
    <figure className="paper letter" style={{ margin: 0 }} aria-label="Sample dispute letter">
      <p>Riverside Medical Center<br />Patient Billing<br />Re: Account 44821, statement dated March 18</p>
      <p>To Patient Billing,</p>
      <p>I am disputing two charges on this statement.</p>
      <p>Lines 14 and 15 bill the same CT scan (code 74177) twice on March 2. Please remove the duplicate charge of $1,240.</p>
      <p>Line 16 is from an out-of-network physician who treated me in your in-network emergency room. Under the No Surprises Act, I owe only my in-network cost sharing for that care. Please correct the $522 charge.</p>
      <p>Please send a corrected, itemized bill and hold this account from collections while you review it. I expect a written reply within 30 days.</p>
      <p style={{ marginBottom: 0 }}>Sincerely,<br />Maria Lopez</p>
      <figcaption className="paper-foot">Sample letter written by Take it back for the bill above. You can edit every word before you send it.</figcaption>
    </figure>
  );
}

/** A sample case for any of the four kinds of problem, as a one-page summary sheet. */
export function SampleFindings({ c }: { c: { tag: string; counterparty: string; title: string; amount: string; savings: string; summary: string; findings: { title: string; amount?: string; rule?: string }[] } }) {
  return (
    <figure className="paper" style={{ margin: 0 }} aria-label={`Sample: what we found on a ${c.tag.toLowerCase()}`}>
      <div className="paper-head">
        <span><strong>{c.counterparty}</strong><br />{c.title}</span>
        <span style={{ textAlign: "right" }}>{c.tag}<br />At stake <strong>{c.amount}</strong></span>
      </div>
      <p style={{ margin: "12px 0" }}>{c.summary}</p>
      <table className="paper-table">
        <thead><tr><th>What we found</th><th>Rule</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
        <tbody>
          {c.findings.map((f) => (
            <tr key={f.title}><td>{f.title}</td><td>{f.rule || ""}</td><td style={{ textAlign: "right" }}>{f.amount || ""}</td></tr>
          ))}
        </tbody>
      </table>
      <figcaption className="paper-foot">Sample case. Names and amounts are made up.</figcaption>
    </figure>
  );
}

/** The letter from a sample case, on paper. */
export function SampleCaseLetter({ to, subject, lines }: { to: string; subject: string; lines: string[] }) {
  return (
    <figure className="paper letter" style={{ margin: 0 }} aria-label="Sample letter">
      <p>{to}<br />Re: {subject}</p>
      <p>To whom it may concern,</p>
      {lines.map((l) => <p key={l}>{l}</p>)}
      <p>Please reply in writing within 30 days.</p>
      <p style={{ marginBottom: 0 }}>Sincerely,<br />Maria Lopez</p>
      <figcaption className="paper-foot">Sample letter. You can edit every word before you send it.</figcaption>
    </figure>
  );
}
