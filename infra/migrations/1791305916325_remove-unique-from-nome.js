exports.up = (pgm) => {
  pgm.dropConstraint("users", "users_nome_key");
};

exports.down = false;
