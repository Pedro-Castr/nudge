exports.up = (pgm) => {
  pgm.addColumn("tasks", {
    completed_at: { type: "timestamptz" },
  });

  // Tarefas já concluídas recebem a última atualização como data de conclusão
  pgm.sql(`UPDATE tasks SET completed_at = updated_at WHERE concluida = true;`);

  pgm.dropColumn("tasks", "concluida");

  pgm.createIndex("tasks", "completed_at", {
    where: "completed_at IS NOT NULL",
  });
};

exports.down = false;
