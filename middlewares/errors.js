const serializeError = require("serialize-error");

function error(logger) {
  return (err, req, res, next) => {
    let status = 500;
    const error = process.env.APP_DEBUG
      ? serializeError(err)
      : { message: "An error occurred" };

    // if we are setting the status code before, we problably are treating the message too
    if (err.statusCode) {
      status = err.statusCode;

      if (!process.env.APP_DEBUG) {
        error.message = err.message || error.message;
      }
    }

    //respond to client
    res.status(status).json({ error });

    logger(err);
  };
}

module.exports = error;
