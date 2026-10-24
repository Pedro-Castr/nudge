import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import HomePage from "@/features/home/homePage";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) redirect("/task");

  return <HomePage />;
}
