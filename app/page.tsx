import type { Metadata } from "next";
import DiaryHome from "./diary-home";
export const metadata: Metadata = {title:"Tammana’s journal — Life, in little pieces",description:"A living scrapbook of little observations, things made by hand, curious projects, and everyday life. The personal journal of Tammana Kapoor."};
export default function Home(){return <DiaryHome/>;}
