const defaultFunctions = {
    request: (req, res) => {
        const { ip, protocol, method, hostname, path, headers, query, params, body } = req;
        
        return {
            request: {
                ip, 
                protocol, 
                method, 
                hostname, 
                path,
                headers,
                query, 
                params,
                body
            }
        };
    },

    logger: (obj) => {
        console.log(obj);
    }
}

function loggerRequests(loggerFunction, extractRequest) {
    const logger = loggerFunction || defaultFunctions.logger;
    const extract = extractRequest || defaultFunctions.request;

    return (req, res, next) => {
        const toLog = extract(req, res);
        logger(toLog);
        
        res.oldJson = res.json;
        res.json = (body) => {
            const toLogResponse = { ...toLog, response: { statusCode: this.statusCode, body } };
            logger(toLogResponse);
            
            return res.oldJson(body);
        };

        next();
    }
}

module.exports = loggerRequests;

