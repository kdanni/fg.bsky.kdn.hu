const DEV_ENV = process.env.ENV === 'DEV';

export const errorHandler = (err, req, res, next) => {
  !DEV_ENV && console.error('[Express Error]', err.message);
  DEV_ENV && console.error('[Express Error]', err);


  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};