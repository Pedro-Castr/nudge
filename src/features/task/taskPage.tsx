import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth/services/getCurrentUser";

export default async function TaskPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return <main>Olá, {user.nome}!</main>;
}
