function error404(req, res, next) {
    const err = new Error('Not found');
    err.statusCode = 404;
    next(err);
}

module.exports = error404;