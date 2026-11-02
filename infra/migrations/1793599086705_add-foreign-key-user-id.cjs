exports.up = (pgm) => {
  pgm.addConstraint("tasks", "fk_tasks_user", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createIndex("tasks", "user_id");
};

exports.down = false;
