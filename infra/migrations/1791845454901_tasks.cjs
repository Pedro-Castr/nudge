exports.up = (pgm) => {
  pgm.createTable("tasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    user_id: {
      type: "uuid",
      notNull: true,
      unique: true,
    },

    nome: {
      type: "varchar(100)",
      notNull: true,
    },

    descricao: {
      type: "varchar(256)",
    },

    concluida: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    posicao: {
      type: "integer",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', 'now()')"),
      notNull: true,
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', 'now()')"),
      notNull: true,
    },
  });
};

exports.down = false;
