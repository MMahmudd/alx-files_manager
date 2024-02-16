/* eslint-disable_no_-unused_-vars */
import { Request, Response, NextFunction } from 'express';
import { getUserFromXToken, getUserFromAuthorization } from '../utils/auth';

/**
 * Applies_Basic_authentication_to_a_route.
 * @param _{Request} req_The_Express_request_object.
 * @param _Response} res_The_Express_response_object.
 * @param _{NextFunction} next_The_Express_next_ function.
 */
export const basicAuthenticate = async (req, res, next) => {
  const user = await getUserFromAuthorization(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
};

/**
 * Applies_X-Token_authentication_to_a_route.
 * @param _{Request}_req The_Express_request_object.
 * @param _{Response}_res_The_Express_response_object.
 * @param _{NextFunction}_next The Express_next_function.
 */
export const xTokenAuthenticate = async (req, res, next) => {
  const user = await getUserFromXToken(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
};
