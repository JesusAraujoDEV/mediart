// middlewares/validator_handler.js

const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    // Agregamos la opción `stripUnknown: true` para eliminar propiedades no definidas en el esquema
    // y `abortEarly: false` para obtener todos los errores.
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

    if (error) {
      next(boom.badRequest(error));
    } else {
      req[property] = value;
      next();
    }
  }
};

module.exports = validatorHandler;