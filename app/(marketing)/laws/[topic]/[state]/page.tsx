import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LawStateView } from "@/components/LawView";
import { pageMeta } from "@/lib/seo";
import { LAW_STATES, LAW_TOPICS, lawStateFromSlug, lawStateSlug, topicBySlug } from "@/lib/lawPages";

export const dynamicParams = false;
export function generateStaticParams() {
  return LAW_TOPICS.flatMap((t) => LAW_STATES.map((s) => ({ topic: t.slug, state: lawStateSlug(s) })));
}

type P = { params: Promise<{ topic: string; state: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await params;
  const t = topicBySlug(p.topic);
  const s = lawStateFromSlug(p.state);
  if (!t || !s) return {};
  const m = pageMeta({ title: t.stateTitle(s), description: t.stateDesc(s), path: `/laws/${t.slug}/${lawStateSlug(s)}` });
  return { ...m, openGraph: { ...m.openGraph, type: "article" } };
}

export default async function LawStatePage({ params }: P) {
  const p = await params;
  const t = topicBySlug(p.topic);
  const s = lawStateFromSlug(p.state);
  if (!t || !s) notFound();
  return <LawStateView topic={t} state={s} />;
}
