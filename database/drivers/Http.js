const Driver = require('./Driver');
const BaseModel = require('../models/BaseModel');

class Http extends Driver {
    constructor(config) {
        super();
        
        this.host = config.host;
        this.defaultHeaders = config.headers || {};
    }

    initialize(model) {
        model.host = this.host;
        model.defaultHeaders = this.defaultHeaders;

        model._setMethod = (method) => {
            model.method = method;
            return model;
        }

        model.get = () => model._setMethod('get');
        model.post = () => model._setMethod('post');
        model.put = () => model._setMethod('put');
        model.delete = () => model._setMethod('delete');
        model.patch = () => model._setMethod('patch');

        model.setQuery = (query) => {
            model.query = query;
            return model;
        }

        model.addQuery = (query) => {
            model.query = { ...model.query, query };
            return model;
        }

        model.setData = (data) => {
            model.data = data;
            return model;
        }

        model.addData = (data) => {
            model.data = { ...model.data, data };
            return model;
        }

        model.setHeaders = (headers) => {
            model.headers = headers;
            return model;
        }

        model.setParam = (name, value) => {
            model.table = model.table.replace(`{${name}}`, value);
            return model;
        }

        model.addHeaders = (headers) => {
            model.headers = { ...model.headers, headers };
            return model;
        }

        model.setSuffix = (suffix) => {
            model.suffix = suffix;
            return model;
        }

        model.addSuffix = (suffix) => {
            model.suffix = `${model.suffix ? model.suffix : ''}${suffix}`;
            return model;
        }

        model.setId = (id) => {
            return this.setSuffix(`/${id}`);
        }

        model.setTimeout = (timeout, timeoutDefault) => {
            model.timeout = timeout;
            model.timeoutDefault = timeoutDefault;

            return model;
        }

        model.call = async () => {
            let queryParams = '';
            if (typeof model.query == 'object' && Object.keys(model.query).length > 0) {
                queryParams = `?${encodeURIComponent(model.query)}`;
            }

            let suffix = ''
            if (model.suffix != null) {
                suffix = model.suffix
            }

            const callObject = {
                method: model.method || 'get',
                url: `${model.host}${model.table}${suffix}${queryParams}`,
            };

            if ((typeof model.headers == 'object' && Object.keys(model.headers).length > 0) || ( typeof model.defaultHeaders == 'object' && Object.keys(model.defaultHeaders).length > 0)) {
                callObject.headers = { ...model.headers, ...model.defaultHeaders };
            }

            if (typeof model.data == 'object' && Object.keys(model.data).length > 0) {
                callObject.data = model.data;
            }

            const promises = [];
            
            const request = require('axios')(callObject).then((response) => response.data);
            promises.push(request);

            if (model.timeout) {
                promises.push(new Promise(resolve => {
                    setTimeout(() => {
                        resolve(model.timeoutDefault || null);
                    }, model.timeout);
                }));
            }

            return await Promise.race(promises);
        }
    }
}

module.exports = Http;