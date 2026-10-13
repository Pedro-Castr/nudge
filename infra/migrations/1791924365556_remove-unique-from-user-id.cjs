exports.up = (pgm) => {
  pgm.dropConstraint("tasks", "tasks_user_id_key");
};

exports.down = false;
