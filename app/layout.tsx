import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DC Co-Business",
  description: "DC Co-Business LINE OA - ห้องพัก ร้านทอง โกดัง เฟอร์นิเจอร์",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}