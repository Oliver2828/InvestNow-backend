// notFound handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// centralized error handler
const errorHandler = (err, req, res, next) => {
  // always log full stack
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // only expose stack in dev
    stack:   process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export { notFound, errorHandler };