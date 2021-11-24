# Middlewares

## loggerRequests

```
const { loggerRequest } = require('way-libs/middleware');

app.use(loggerRequest());
```

The first param is a logger function

```
function loggerFunction(logData) {
    console.log(logData);
}

app.use(loggerRequest(loggerFunction));
```

The second param is the extract information from the request and response function

```
function loggerFunction(logData) {
    console.log(logData);
}

function extract(req, res) {
    return {
        hostname: req.hostname
    }
}

// in this case just the hostname will be logged
// by default the lib already have a 
```

## error404

```
const { error404 } = require('way-libs/middlewares');

app.use(error404);
```

## errors

```
const { errors } = require('way-libs/middlewares');

app.use(errors);
```