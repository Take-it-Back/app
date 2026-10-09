import { requireUser } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import { deleteAccount, updateProfile } from "@/lib/actions";
import { US_STATES } from "@/lib/states";
import PasswordReset from "./PasswordReset";

export default async function YouPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const { reset } = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  return (
    <main className="app-main">
      <div className="stack g20">
        <h1 className="page-title">You</h1>
        <div className="row g12">
          <Avatar size={56} />
          <span className="stack"><span style={{ fontWeight: 500, fontSize: 17 }}>{p?.full_name || "Add your name"}</span><span className="muted small">{user.email}</span></span>
        </div>

        {reset && <PasswordReset />}

        <div className="panel-orange stack g8">
          <span className="serif" style={{ fontSize: 22 }}>Free while we're in <em className="o">early access</em></span>
          <span className="small" style={{ color: "#4A4A4A" }}>Every feature is included right now. Premium, with certified mail sent for you and family members, is coming. Early users will get a free trial.</span>
        </div>

        <form action={updateProfile} className="stack g12">
          <span className="eyebrow">Your details</span>
          <label className="field"><span style={{ fontSize: 14 }}>Name on your letters</span><input name="full_name" className="input" defaultValue={p?.full_name || ""} /></label>
          <label className="field">
            <span style={{ fontSize: 14 }}>State</span>
            <select name="state" className="input" defaultValue={p?.state || ""}>
              <option value="">Choose your state</option>
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <span className="eyebrow" style={{ marginTop: 8 }}>Reminders</span>
          <label className="row between" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15 }}>Email me before deadlines<input type="checkbox" role="switch" name="remind_email" defaultChecked={p?.remind_email ?? true} style={{ width: 22, height: 22, accentColor: "#1A1A1A" }} /></label>
          <label className="row between" style={{ padding: "12px 0", fontSize: 15 }}>Morning briefing on Today<input type="checkbox" role="switch" name="morning_briefing" defaultChecked={p?.morning_briefing ?? true} style={{ width: 22, height: 22, accentColor: "#1A1A1A" }} /></label>
          <button className="btn-plain" style={{ alignSelf: "flex-start", background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A" }}>Save</button>
        </form>

        <div className="stack">
          <span className="eyebrow">Privacy</span>
          <p className="muted small" style={{ margin: "6px 0" }}>Your documents are private to you, never sold and never used for ads.</p>
          <a href="/api/export" className="list-row">Download all my data</a>
          <form action="/auth/signout" method="post"><button className="list-row btn-text" style={{ width: "100%", justifyContent: "flex-start", borderBottom: "1px solid #EBEBEB" }}>Sign out</button></form>
          <form action={deleteAccount}>
            <ConfirmSubmit message="Delete your account, every case and every file? This can't be undone." className="btn-text" style={{ color: "#A8441F" }}>Delete my account and everything in it</ConfirmSubmit>
          </form>
        </div>
      </div>
    </main>
  );
}
