// Definición del modelo de Comment con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    { text: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario"} }
      },
      published: {
 			  type: DataTypes.BOOLEAN,
 			  defaultValue: false
      }
    }
  );
}
