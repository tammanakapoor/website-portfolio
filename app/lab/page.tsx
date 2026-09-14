import type { Metadata } from "next";
import LabExperience from "./lab-experience";

export const metadata: Metadata = {
  title: "Tammana Kapoor — Motion & spatial design study",
  description: "An interactive portfolio concept exploring motion, liquid glass and dimensional design.",
};

export default function LabPage() {
  return <LabExperience />;
}
