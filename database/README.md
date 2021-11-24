# Database

You can use the database as follow

## Mysql

### Creating your datasource
`MainDatabase.js`
```
const { Drivers } = require('way-libs/database');
const knexConfig = require('./knexfile.json');

class MainDatabase extends Drivers.Mysql {
    constructor() {
        super(knexConfig);
    }
}

module.exports = MainDatabase;
```

### Creating your models
`Usuario.js`
```
const { BaseModel } = require('way-libs/database');
const MainDatabase = require('./MainDatabase');

class Usuario extends BaseModel {
    constructor() {
        super('tb_usuario', new MainDatabase());

        // this.setPrimaryKey('id'); // You can define the primary key, default 'id'
    }
}

module.exports = new Usuario();
```

### Functions

#### Usuario.find(where, fields, transaction)
- `where` is an object to filter (null for no-filters)
- `fields` is the fields you want to retrieve (null for everything)
- `transaction` Knex.Transaction object if you need to do that inside a transaction

#### Usuario.findById(id, fields, transaction)
- `id` is the id or an object of compounded ids you want to retrieve
- `fields` is the fields you want to retrieve (null for everything)
- `transaction` Knex.Transaction object if you need to do that inside a transaction

#### Usuario.update(where, payload, transaction)
- `where` is an object to filter
- `payload` is the object of fields to be updated with values
- `transaction` Knex.Transaction object if you need to do that inside a transaction

#### Usuario.updateById(id, payload, transaction)
- `id` is the id or an object of compounded ids you want to retrieve
- `payload` is the object of fields to be updated with values
- `transaction` Knex.Transaction object if you need to do that inside a transaction

#### Usuario.insert(payload, transaction)
- `payload` is the object of fields to be inserted with values
- `transaction` Knex.Transaction object if you need to do that inside a transaction

#### Usuario.insertMany(payload, transaction)
- `payload` is and array of object of fields to be inserted with values
- `transaction` Knex.Transaction object if you need to do that inside a transaction

#### Usuario.deleteById(id, transaction)
- `id` is the id or an object of compounded ids you want to retrieve
- `transaction` Knex.Transaction object if you need to do that inside a transaction


### Transactions

In knex transactions with `async` functions has autocommits, so if there is no errors inside the `async` function it will commit, if there is errors, it will rollback.

```
const MainDatabase = require('./MainDatabase');
const Usuario = require('./Usuario');

const database = new MainDatabase();

database.startTransaction(async (transaction) => {
    await Usuario.insert({ ... }, transaction);
});
```

## Elasticsearch

### Creating your datasource
`Datasource.js`
```
const { Drivers } = require('way-libs/database');
const config = {
    index: 'database',
    hosts: [
        'https://'
    ]
};

class Datasource extends Drivers.Elasticsearch {
    constructor() {
        super(config);
    }
}

module.exports = Datasource;
```

### Creating your models
`Table.js`
```
const { BaseModel } = require('way-libs/database');
const Datasource = require('./Datasource');

class Table extends BaseModel {
    constructor() {
        super('table', new Datasource());

        // this.setPrimaryKey('id'); // You can define the primary key, default 'id'
    }
}

module.exports = new Table();
```

### Functions

#### Table.find(query)
- `query` object with the search params

#### Table.insert(payload)
- `payload` the object to be inserted *The pk must be inside*

#### Table.updateById(id, payload)
- `id` to be updated
- `payload` the object to be updated

#### Table.deleteById(id)
- `id` to be deleted

## Http

`Datasource.js`
```
const { Drivers } = require('way-libs/database');

const configHttp = {
    host: 'http://hmg.waytaxi.com:4212',
    headers: {
        'Content-Type': 'application/json',
        'X-Finance-Authorization': 'dg6WuzRalE5wxZJIgU7OStC8Ic5xBC1CXhd8NGeW'
    }
};

class WayFinanceDS extends Drivers.Http {
    constructor() {
        super(configHttp);
    }
}

module.exports = WayFinanceDS;
```

`FilesResource.js`
```
const { BaseModel } = require('way-libs/database');
const WayFinanceDS = require('./WayFinanceDS');

class FilesResource extends BaseModel {
    constructor() {
        super('/v1/paymentFiles', new WayFinanceDS());
    }
}

module.exports = new FilesResource();
```

`Usage`
```
const FilesResource = require('./FilesResource');

FilesResource
    .addSuffix('/all')
    .call()
    .then((data) => {
        console.log(data);
    });
```

### Functions

The model is a buildable object that will make a http request at the end

#### FilesResource.get
Set method as GET

#### FilesResource.post
Set method as POST

#### FilesResource.put
Set method as PUT

#### FilesResource.delete
Set method as DELETE

#### FilesResource.patch
Set method as PATCH

#### FilesResource.setQuery(query)
Set the query object

#### FilesResource.addQuery(query)
Append the query object

#### FilesResource.setData(data)
Set the data object

#### FilesResource.addData(data)
Append the data object

#### FilesResource.setHeaders(headers)
Set the headers object

#### FilesResource.addHeaders(headers)
Append the headers object

#### FilesResource.setSuffix(suffix)
Set the suffix of the url

#### FilesResource.addSuffix(suffix)
Append the suffix of the url

#### FilesResource.setId(id)
Override the suffix whe the id

#### FileResource.call
Execute the http request and return a promise of the data