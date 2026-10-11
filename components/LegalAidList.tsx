import { legalAidFor, telHref, type AidLink } from "@/lib/legalAid";

function Row({ title, sub, url, phone, tag }: { title: string; sub?: string; url: string; phone?: string | null; tag?: string }) {
  return (
    <li className="stack g8" style={{ padding: "14px 0", borderBottom: "1px solid #EBEBEB" }}>
      <span className="stack g4">
        <span style={{ fontWeight: 600, fontSize: 16 }}>{title}{tag && <span className="tag tag-gray" style={{ marginLeft: 8 }}>{tag}</span>}</span>
        {sub && <span className="muted small">{sub}</span>}
      </span>
      <span className="row wrap g8">
        {phone && <a href={telHref(phone)} className="btn-plain">Call {phone}</a>}
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-plain">Website ↗</a>
      </span>
    </li>
  );
}

/** Legal aid for one state. `focus` puts tenant help first for landlord problems. */
export default function LegalAidList({ state, focus }: { state: string; focus?: "tenant" }) {
  const a = legalAidFor(state);
  if (!a) return null;
  const tenant = a.tenant as AidLink | null;
  return (
    <div className="card" style={{ padding: "4px 18px" }}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {focus === "tenant" && tenant && <Row title={tenant.name} sub="Tenant help" url={tenant.url} phone={tenant.phone} tag="Renters" />}
        {a.orgs.map((o) => <Row key={o.name} title={o.name} sub={`Free civil legal aid · ${o.area}`} url={o.url} phone={o.phone} />)}
        <Row title={a.portal.name} sub="Find help by county and problem, with free guides and forms" url={a.portal.url} />
        {focus !== "tenant" && tenant && <Row title={tenant.name} sub="Tenant help" url={tenant.url} phone={tenant.phone} tag="Renters" />}
        {a.referral && <Row title={a.referral.name} sub="If you don't qualify for free help: a lawyer for a low-cost first meeting" url={a.referral.url} phone={a.referral.phone} />}
      </ul>
      <p className="muted small" style={{ margin: "12px 0 14px" }}>Legal aid is free if your income qualifies. Call early: there&apos;s often a wait, and court dates don&apos;t move. Listings checked October 2026.</p>
    </div>
  );
}
