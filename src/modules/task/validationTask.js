import Joi from "joi";

export const validationAddTask = Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().min(5).required(),
    deadline: Joi.date().min(new Date()).required(),
    assignTo: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid User ID format for assignTo',
    }),
}).required()

export const validationGetTasksAssignToAnyOne = Joi.object({
  id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid ID format',
  }),
}).required()

export const validationUpdateTask = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().min(5).required(),
  status: Joi.string().valid('open', 'in-progress', 'completed').required(),
  assignTo: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid User ID format for assignTo',
  }),
  deadline: Joi.date().min(new Date()).required(),
  id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid Task ID format',
  }),
}).required()

export const validationDeleteTask = Joi.object({
  id: Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid Task ID format',
  }),
  // token: Joi.string().trim().required().pattern(/^bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
}).required()