import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ITRFilingClient } from "./ITRFilingClient";

export const metadata: Metadata = {
  title: "ITR Filing Service | LiquiFi",
  description:
    "File your Income Tax Return starting at ₹499. Expert CA-assisted filing for salaried, business, and HNI individuals. Fast, accurate, 100% online.",
};

export default function ITRFilingPage() {
  return (
    <main>
      <Navbar />
      <ITRFilingClient />
      <Footer />
    </main>
  );
}
