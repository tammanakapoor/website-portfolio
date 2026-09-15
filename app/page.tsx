import type { Metadata } from "next";
import CardHome from "./card-home";

export const metadata: Metadata = {
  title: "Tammana Kapoor — a curious little corner",
  description:
    "The portfolio of Tammana Kapoor: educator, designer, vibe coder and collector of new hobbies.",
};

export default function Home() {
  return <CardHome />;
}
