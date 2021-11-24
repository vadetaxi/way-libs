const Driver = require('./Driver');

class Redis extends Driver {
    constructor(client) {
        super();
        
        this.db = client
    }

    initialize(model) {
        model.db = this.db;

        model.insert = (object, expireSeconds = null) => {
            const pk = model.pk || 'id';

            return new Promise((resolve, reject) => {
                if (!object[pk]) {
                    reject(new Error(`PK ${pk} is not defined`));
                }

                const key = `${model.table}:${object[pk]}`;

                model.db.exists(key, (err, exists) => {
                    if (err) {
                        reject(err);
                    }

                    if (exists) {
                        reject(new Error(`PK ${object[pk]} is already in use`));
                    }

                    model.db.set(key, JSON.stringify(object), (err, r) => {
                        if (err) {
                            reject(err);
                        }

                        if (expireSeconds) {
                            model.db.expire(key, expireSeconds, (err, r) => {
                                if (err) {
                                    reject(err);
                                }

                                resolve(true);
                            });
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        }

        model.update = (id, object, expireSeconds = null) => {
            const pk = model.pk || 'id';

            return new Promise((resolve, reject) => {
                object[pk] = id;
                const key = `${model.table}:${object[pk]}`;

                model.db.exists(key, (err, exists) => {
                    if (err) {
                        reject(err);
                    }

                    if (!exists) {
                        reject(new Error(`PK ${object[pk]} not exists to be updated`));
                    }

                    model.db.set(key, JSON.stringify(object), (err, r) => {
                        if (err) {
                            reject(err);
                        }

                        if (expireSeconds) {
                            model.db.expire(key, expireSeconds, (err, r) => {
                                if (err) {
                                    reject(err);
                                }

                                resolve(true);
                            });
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        }

        model.findById = (id) => {
            return new Promise((resolve, reject) => {
                model.db.get(`${model.table}:${id}`, (err, data) => {
                    if (err) {
                        reject(err);
                    }

                    try {
                        resolve(JSON.parse(data));
                    } catch(err) {
                        reject(err);
                    }
                });
            });
        };

        model.findAll = (withKeys = false) => {
            return new Promise((resolve, reject) => {
                model.db.keys(`${model.table}:*`, async (err, keys) => {
                    if (err) {
                        reject(err);
                    }

                    let data;
                    
                    if (withKeys) {
                        data = {};
                    } else {
                        data = [];
                    }

                    if (keys) {
                        for(let key of keys) {
                            const realKey = key.replace(`${model.table}:`, '');
                            const keyData = await model.findById(realKey);
                            if (keyData) {
                                if (withKeys) {
                                    data[realKey] = keyData;
                                } else {
                                    data.push(keyData);
                                }
                            }
                        }
                    }

                    resolve(data);
                });
            });
        };

        model.deleteById = (id) => {
            return new Promise((resolve, reject) => {
                model.db.del(`${model.table}:${id}`, (err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(true);
                });
            });
        }
    }
}

module.exports = Redis;