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
  },

  validateSignin: data => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .alphanum()
        .required()
    });

    return schema.validate(data);
  },

  validateAnnouncement: data => {
    const schema = Joi.object({
      mentorId: Joi.number().required(),
      title: Joi.string().required(),
      questions: Joi.string().required()
    });

    return schema.validate(data);
  },

  validateMentorResponse: data => {
    const schema = Joi.object({
      response: Joi.string().required()
    });

    return schema.validate(data);
  }
};

export default validate;
