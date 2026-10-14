import { redirect } from "next/navigation";

import { getCurrentUser } from "../auth/services/getCurrentUser";
import TaskCompose from "./components/taskCompose";
import TaskList from "@/features/task/components/taskList";
import type { Task } from "@/features/task/types/task";

const EXAMPLE_TASKS: Task[] = [
  {
    id: "1",
    nome: "Pagar o boleto do condomínio",
    descricao: "O código de barras está no e-mail do síndico.",
    concluida: false,
  },
  {
    id: "2",
    nome: "Ligar para o dentista",
    descricao: null,
    concluida: false,
  },
  {
    id: "3",
    nome: "Revisar o contrato de aluguel, conferir as cláusulas de reajuste e enviar todas as dúvidas para a imobiliária antes do fim da semana",
    descricao:
      "Atenção especial ao índice de reajuste e à multa de rescisão. Pedir a versão em PDF.",
    concluida: false,
  },
  {
    id: "4",
    nome: "Enviar o relatório",
    descricao: null,
    concluida: true,
  },
];

export default async function TaskPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <div>
      <TaskCompose />
      <TaskList tasks={EXAMPLE_TASKS} />
    </div>
  );
}
