"use client";
import { useEffect } from "react";
import WhimsyHome from "./whimsy-home";
import { initWhimsyHome } from "../public/whimsy-home.js";
import "./whimsy-home.css";
export default function TypewriterHome() {
  useEffect(() => initWhimsyHome(document), []);
  return <WhimsyHome />;
}
