const Driver = require('./Driver');

class Mysql extends Driver {
    constructor(client) {
        super();
        
        this.db = client;
    }

    startTransaction(transactionFunction) {
        return this.db.transaction(transactionFunction);
    }

    initialize(model) {
        model.db = this.db;
        
        model.find = this.find(model);
        model.findById = this.findById(model, model.find);
        model.insert = this.insert(model);
        model.update = this.update(model);
        model.updateById = this.updateById(model, model.update);
        model.deleteById = this.deleteById(model);
        model.insertMany = this.insertMany(model);
    }

    find(model) {
        return (where, fields, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            const builder = this.db(model.table);

            if (fields) {
                if (!(fields instanceof Array)) {
                    throw new Error('expect fields to be an array');
                }

                builder.select(fields);
            }

            if (transaction) {
                builder.transacting(transaction);
            }

            if (where) {
                if (typeof(where) !== 'object') {
                    throw new Error(`invalid where params on find: ${JSON.stringify(where)}`);
                }
                return builder.where(where);
            }

            return builder;
        }
    }

    findById(model, find) {
        return (id, fields, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            const pk = model.pk || 'id';
            const compoundKey = pk instanceof Array;

            if (compoundKey && typeof(id) !== 'object') {
                throw new Error(`${typeof(id)} received as param, object expected`);
            }
            
            const builder = this.db(model.table);

            if (fields) {
                if (!(fields instanceof Array)) {
                    throw new Error('expect fields to be an array');
                }

                builder.select(fields);
            }

            if (transaction) {
                builder.transacting(transaction);
            }

            const where = {};
            if (compoundKey) {
                for(let key of pk) {
                    if (id[key] == undefined) {
                        throw new Error(`Expected key '${key}' not found`);
                    }

                    where[key] = id[key];
                }
            } else {
                where[pk] = id;
            }

            return find(where, fields, transaction)
                .then((items) => items[0] ? items[0] : null);
        }
    }

    insert(model) {
        return (payload, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            const builder = this.db(model.table);

            if (transaction) {
                builder.transacting(transaction);
            }

            return builder
                .insert(payload, model.pk);
        }
    }

    update(model) {
        return (where, payload, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            if (!where) {
                throw new Error('where is required');
            }

            const builder = this.db(model.table);

            if (transaction) {
                builder.transacting(transaction);
            }

            return builder
                .where(where)
                .update(payload, model.pk);
        }
    }

    updateById(model, update) {
        return (id, payload, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            const pk = model.pk || 'id';
            const compoundKey = pk instanceof Array;

            if (compoundKey && typeof(id) !== 'object') {
                throw new Error(`${typeof(id)} received as param, object expected`);
            }

            const where = {}
            if (compoundKey) {
                for(let key of pk) {
                    if (id[key] == undefined) {
                        throw new Error(`Expected key '${key}' not found`);
                    }

                    where[key] = id[key];
                }
            } else {
                where[pk] = id;
            }

            return update(where, payload, transaction);
        }
    }

    deleteById(model) {
        return (id, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            const pk = model.pk || 'id';
            const compoundKey = pk instanceof Array;

            if (compoundKey && typeof(id) !== 'object') {
                throw new Error(`${typeof(id)} received as param, object expected`);
            }

            const where = {}
            if (compoundKey) {
                for(let key of pk) {
                    if (id[key] == undefined) {
                        throw new Error(`Expected key '${key}' not found`);
                    }

                    where[key] = id[key];
                }
            } else {
                where[pk] = id;
            }

            const builder = this.db(model.table);

            if (transaction) {
                builder.transacting(transaction);
            }

            return builder.where(where).del();
        }
    }

    insertMany(model) {
        return (payload, transaction) => {
            if (model.table == undefined) {
                throw new Error('table is not defined');
            }

            if (!(payload instanceof Array)) {
                throw new Error('to insert many and array of items is required');
            }

            const builder = this.db
                .batchInsert(model.table, payload, 500)
                .returning(model.pk);

            if (transaction) {
                builder.transacting(transaction);
            }

            return builder;
        }
    }
}

module.exports = Mysql;