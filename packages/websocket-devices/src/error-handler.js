import { AuthorizationError } from 'core';

export const errorHandler = (error, reply) => {
  if (error instanceof AuthorizationError) {
    reply
      .code(401)
      .type("application/json")
      .send({message: error.message})
  }

  if ((error instanceof AuthorizationError) == false) {
    reply
      .code(400)
      .type("application/json")
      .send({message: error.message})
  }
}