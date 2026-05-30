import type { Metadata } from "next";
import { BalanceTransferClient } from "./BalanceTransferClient";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Balance Transfer & Loan Consolidation | LiquiFi",
  description:
    "Transfer credit card debt and personal loans to a single lower-rate EMI. Rates from 10.5% p.a. Save up to 40% on monthly payments.",
};

export default function BalanceTransferPage() {
  return (
    <main>
      <Navbar />
      <BalanceTransferClient />
      <Footer />
    </main>
  );
}
