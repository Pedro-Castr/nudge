import { Bricolage_Grotesque, Figtree } from "next/font/google";

import Background from "@/components/background";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const body = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-color="blue"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <Background />
        {children}
      </body>
    </html>
  );
}
