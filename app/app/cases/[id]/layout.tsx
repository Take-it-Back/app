import CaseTabs from "@/components/CaseTabs";

export default async function CaseLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="case-wrap">
      <CaseTabs id={id} />
      {children}
    </div>
  );
}
