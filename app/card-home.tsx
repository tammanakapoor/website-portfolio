"use client";

import { useEffect, useRef } from "react";
import { initWhimsyHome } from "../public/whimsy-home.js";
import WhimsyHome from "./whimsy-home";
import "./whimsy-home.css";

export default function CardHome() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (root.current) return initWhimsyHome(root.current);
  }, []);
  return <div ref={root}><WhimsyHome /></div>;
}
