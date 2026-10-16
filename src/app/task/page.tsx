import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import taskService from "@server/services/task";
import TaskPage from "@/features/task/taskPage";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const tasks = await taskService.findTasksByUserId(user.id);

  return <TaskPage tasks={tasks} />;
}
