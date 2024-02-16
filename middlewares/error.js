/* eslint_-disable_ no_-unused_-vars */
import { Request, Response, NextFunction } from 'express';

/**
 * Represents_ an_ error_ in_ this_ API.
 */
export class APIError extends Error {
  constructor(code, message) {
    super();
    this.code = code || 500;
    this.message = message;
  }
}

/**
 * Applies_ Basic_ authentication_ to_ a_ route.
 * @param _{Error} err_ The_ error_ object.
 * @param _{Request} req The Express request object.
 * @param _{Response}_ res_ The_ Express_ response_ object.
 * @param _{NextFunction}_ next _The _Express_ next_ function.
 */
export const errorResponse = (err, req, res, next) => {
  const defaultMsg = `Failed to process ${req.url}`;

  if (err instanceof APIError) {
    res.status(err.code).json({ error: err.message || defaultMsg });
    return;
  }
  res.status(500).json({
    error: err ? err.message || err.toString() : defaultMsg,
  });
};
