import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Projects — Tammana’s journal",
  description: "Daily Café, FloraQuest, Making Energy Changes Visible and Fieldnotes: the ideas, the making, and what changed along the way.",
};

export default function ProjectsPage() {
  redirect("/#projects");
}
