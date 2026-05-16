import { DashboardNav } from "@/components/DashboardNav";

export const metadata = {
  title: "Dashboard — LiquiFi",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNav />
      <main className="pt-16">{children}</main>
    </>
  );
}
