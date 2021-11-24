const BaseJoi = require('joi');
const JoiDate = require('joi-date-extensions');
const Joi = BaseJoi.extend(JoiDate);

const getDataError = (error) => {
    data = error.details.map(element => {
        return {
            path: element.path,
            message: element.message
        }
    });

    return data;
}

module.exports = {

    validate: (schema) => {

        let list = Array();

        if (schema.hasOwnProperty('params')) {
            list.push(module.exports.params(schema.params));
        }

        if (schema.hasOwnProperty('query')) {
            list.push(module.exports.query(schema.query));
        }

        if (schema.hasOwnProperty('body')) {
            list.push(module.exports.body(schema.body));
        }

        if (schema.hasOwnProperty('headers')) {
            list.push(module.exports.headers(schema.headers));
        }

        return list;

    },

    params: (schema, name) => {
        return (req, res, next) => {
            let result = Joi.validate(req.params, schema)

            if (result.error) {
                return res.status(400).json({
                    error: getDataError(result.error)
                });
            }
            else {
                if (!req.value)
                    req.value = {};
                if (!req.value['params'])
                    req.value['params'] = {};

                req.value['params'][name] = result.value[name];
                next();
            }
        }
    },

    query: (schema) => {
        return (req, res, next) => {
            let result = Joi.validate(req.query, schema);

            if (result.error) {
                return res.status(400).json({
                    error: getDataError(result.error)
                });
            }
            else {
                if (!req.value)
                    req.value = {};
                if (!req.value['query'])
                    req.value['query'] = {};

                req.value['query'] = result.value;
                next();
            }
        }
    },

    body: (schema) => {
        return (req, res, next) => {
            let result = Joi.validate(req.body, schema);

            if (result.error) {

                return res.status(400).json({
                    error: getDataError(result.error)
                });
            }
            else {
                if (!req.value)
                    req.value = {};
                if (!req.value['body'])
                    req.value['body'] = {};

                req.value['body'] = result.value;
                next();
            }
        }
    },

    headers: (schema) => {
        return (req, res, next) => {
            let result = Joi.validate(req.headers, schema, { "allowUnknown": true });

            if (result.error) {

                return res.status(400).json({
                    error: getDataError(result.error)
                });
            }
            else {
                if (!req.value)
                    req.value = {};
                if (!req.value['headers'])
                    req.value['headers'] = {};

                req.value['headers'] = result.value;
                next();
            }
        }
    }
}
