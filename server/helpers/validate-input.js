import Joi from '@hapi/joi';

const validate = {
  validateSignup: data => {
    const schema = Joi.object({
      first_name: Joi.string()
        .min(3)
        .max(35)
        .required(),
      last_name: Joi.string()
        .min(3)
        .max(35)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .alphanum()
        .min(8)
        .required(),
      address: Joi.string()
        .min(3)
        .required(),
      bio: Joi.string()
        .min(10)
        .required(),
      occupation: Joi.string()
        .min(5)
        .required(),
      expertise: Joi.string()
        .min(5)
        .required()
    });

    return schema.validate(data);
  }
};

export default validate;
