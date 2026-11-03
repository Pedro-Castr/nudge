import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import { AuthPage } from "@/features/auth/authPage";

export const metadata: Metadata = {
  title: "Entrar",
};

export default async function Page() {
  const user = await getCurrentUser();
  if (user) redirect("/task");

  return <AuthPage />;
}
