import { Bricolage_Grotesque, Figtree } from "next/font/google";

import Background from "@/components/background";
import "@/app/styles/globals.css";
import "@/app/styles/themes.css";

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
      className={`${display.variable} ${body.variable}`}
      data-color="azul"
    >
      <body>
        <Background />
        {children}
      </body>
    </html>
  );
}
