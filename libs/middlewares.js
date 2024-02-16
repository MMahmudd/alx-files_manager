import express from 'express';

/**
 * Adds middlewares_to_the_given_express_ application.
 * @param _{express.Express}_api_The_express_application.
 */
const injectMiddlewares = (api) => {
  api.use(express.json({ limit: '200mb' }));
};

export default injectMiddlewares;
