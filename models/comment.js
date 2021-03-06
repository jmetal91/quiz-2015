// Definición del modelo de Comment (comentario) con validación
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    { texto: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "-> Por favor, escriba un comentario" }}
      },
      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }
  );
}
