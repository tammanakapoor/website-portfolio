import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectJournal from "../../project-journal";
import { getProject, projects } from "../data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found — Tammana Kapoor" };
  const description = p.id === "fieldnotes" ? "A personal field guide to London’s trees. Explore, collect discoveries on your walks, and keep a journal of places and observations." : p.tagline;
  return {
    title: `${p.title} — Tammana Kapoor`,
    description,
    openGraph: { title: `${p.title} — Tammana Kapoor`, description, images: [p.cover.src] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];
  return <ProjectJournal project={p} projects={projects} next={next}/>;
}
