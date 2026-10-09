import { requireUser } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plan";
import { BackLink } from "@/components/ui";
import Upsell from "@/components/Upsell";
import CopyButton from "@/components/CopyButton";

export default async function InboxPage() {
  const { supabase, user } = await requireUser();
  const [{ data: p }, plan] = await Promise.all([supabase.from("profiles").select("inbox_token").eq("id", user.id).maybeSingle(), getPlan(supabase, user.id)]);
  const domain = process.env.INBOUND_DOMAIN || "in.takeitback.app";
  const enabled = Boolean(process.env.INBOUND_SECRET && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const address = p?.inbox_token ? `${p.inbox_token}@${domain}` : null;

  return (
    <main className="app-main">
      <BackLink href="/app/tools" />
      <div className="stack g4" style={{ margin: "6px 0 18px" }}>
        <h1 className="page-title" style={{ fontSize: 38 }}>Forward bills by <em className="o">email</em></h1>
        <span className="muted" style={{ fontSize: 15 }}>Got a bill, denial or notice by email? Forward it here and it becomes a case, read and ready.</span>
      </div>
      {!plan.premium ? (
        <Upsell title="Your own address for bills" body="Forward any bill or denial email with its attachment. We create the case, read it and set your deadline." />
      ) : (
        <div className="stack g20">
          {!enabled && <p className="panel-gray" style={{ margin: 0 }}>Email forwarding is being switched on. Your address is ready below and will start working soon.</p>}
          <div className="panel-orange stack g12">
            <span className="small" style={{ color: "#A8441F" }}>Your private address</span>
            <span className="serif" style={{ fontSize: "clamp(20px, 6vw, 28px)", wordBreak: "break-all" }}>{address}</span>
            {address && <CopyButton text={address} label="Copy address" />}
          </div>
          <section>
            <div className="sec-head"><h2>How it works</h2></div>
            <ol className="band stack" style={{ margin: 0, listStyle: "none", padding: "6px 18px" }}>
              {[
                ["Forward the email", "Include the PDF or photo attachment if there is one."],
                ["We open a case", "It shows up in your cases within a minute, already read."],
                ["Pick up from there", "See what we found, your deadline, and the letter to send."],
              ].map(([t, b], i) => (
                <li key={t} className="row g12" style={{ padding: "12px 0", alignItems: "flex-start", borderBottom: i < 2 ? "1px solid #E4E4E4" : 0 }}>
                  <span className="serif" style={{ fontSize: 22, color: "#BF4F28", width: 18 }}>{i + 1}</span>
                  <span className="stack g4"><span style={{ fontWeight: 500 }}>{t}</span><span className="muted small">{b}</span></span>
                </li>
              ))}
            </ol>
          </section>
          <p className="muted small">Anything sent to this address becomes a case in your account, so keep it private.</p>
        </div>
      )}
    </main>
  );
}
