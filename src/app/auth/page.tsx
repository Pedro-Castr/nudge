import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import { AuthPage } from "@/features/auth/authPage";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) redirect("/task");

  return <AuthPage />;
}
