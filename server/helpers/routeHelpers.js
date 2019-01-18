const Joi = require('joi')

module.exports = {

  validateBody: (schema) => {

    return (req, res, next) => {
      const result = Joi.validate(req.body, schema)
      
      if (result.error) {
        return res.status(400).json(result.error)
      }

// req.value.body will replace req.body w formated data
      if (!req.value) { req.value = {} }
      req.value['body'] = result.value
      next()
    }


  },

  schemas: {
    authSchema: Joi.object().keys({

      email: Joi
        .string()
        .email()
        .lowercase()
        .required(),
      password: Joi
        .string()
        .required()

    })
  }

}
