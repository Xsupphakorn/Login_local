const Joi = require("joi");


const userSchema = Joi.object({
    email: Joi.string().email().optional(),
    user_id: Joi.number().integer().optional(),
    password: Joi.string().min(6).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])\S{8,}$/)).optional(),
    username: Joi.string().max(50).optional(),
    newUsername: Joi.string().max(50).optional(),
    newPassword: Joi.string().min(6).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])\S{8,}$/)).optional(),
    newEmail: Joi.string().email().optional(),
    due_date: Joi.date().iso().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().optional(),
    priority: Joi.string().optional(),
    task_id: Joi.number().integer().optional(),
    comment: Joi.string().optional(),
    comment_id: Joi.number().integer().optional(),
}).options({ abortEarly: false });

const validationMiddleware = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        // Handle validation error
        console.log(error.message);
        res.status(400).json({ error: error.details });
      } else {
        // Data is valid, proceed to the next middleware
        next();
      }
    };
  };


  module.exports = {
    userSchema,
    validationMiddleware,
  };