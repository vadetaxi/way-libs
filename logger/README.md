# Logger

## Applying logger

```
const loggerConfig = {
    accessKeyId: '',
	secretAccessKey: '',
	region: '',
	uploadMaxTimer: 3000,
	appName: "APP-NAME"
};

global logger = require('way-libs/logger')(loggerConfig);
```

### logger.log(type, data)
- `type` the type of logger
- `data` the data to be logged

### logger.custom(type)
- `type` the type of logger

returns a function to log into that type

```
const loggerRequest = logger.type('request');
loggerRequest('test');
```

is the same of

```
logger.log('request', 'test');
```

### Other functions

- `logger.logByYear()` create a type of Year. ex: 2019
- `logger.logByMonth()` create a type of Year-Month. ex: 2019-02
- `logger.logByDay()` create a type of Year-Month-Day. ex: 2019-02-21
- `logger.logByHour()` create a type of Year-Month-Day-Hour. ex: 2019-02-21-18
- `logger.logByMinute()` create a type of Year-Month-Day-Hour-Minute. ex: 2019-02-21-18-30