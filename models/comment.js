// Definición del modelo de Comment con validación
//var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'comment',
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
