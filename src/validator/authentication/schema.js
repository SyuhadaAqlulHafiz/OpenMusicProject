import Joi from 'joi';

export const postAuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const putAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const deleteAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});