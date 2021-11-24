const Driver = require("./Driver");

class Elasticsearch extends Driver {
  constructor(client) {
    super();

    this.client = client;
  }

  initialize(model) {
    model.client = this.client;
    model.index = model.table;
    model.pk = model.pk || "id";

    model.find = this.find(model);
    model.insert = this.insert(model);
    model.updateById = this.updateById(model, model.insert);
    model.deleteById = this.deleteById(model);
  }

  insert(model) {
    return payload => {
      return new Promise((resolve, reject) => {
        if (!payload[model.pk]) {
          throw new Error("Need to specify the pk on insertOrUpdate");
        }

        const document = {
          index: model.table,
          type: "_doc",
          id: payload[model.pk],
          body: payload
        };

        this.client.index(document, (err, response, status) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
      });
    };
  }

  updateById(model, insertOrUpdate) {
    return (id, payload) => {
      const newPayload = {
        ...payload
      };
      newPayload[model.pk] = id;

      return insertOrUpdate(newPayload);
    };
  }

  deleteById(model) {
    return id => {
      return new Promise((resolve, reject) => {
        const filter = {
          index: model.table,
          type: "_doc",
          id
        };

        this.client.delete(filter, (err, response, status) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
      });
    };
  }

  count(model) {
    return () => {
      return new Promise((resolve, reject) => {
        const filter = {
          index: model.table,
          type: "_doc"
        };
        this.client.count(filter, (err, response, status) => {
          if (err) {
            reject(err);
          }

          resolve(response);
        });
      });
    };
  }

  find(model) {
    return query => {
      return new Promise((resolve, reject) => {
        const treatFilters = (filters, q, prefix = "") => {
          for (let key of Object.keys(q)) {
            if (prefix) {
              prefix += ".";
            }
            const keyField = `${prefix}${key}`;

            if (q[key] != null && typeof q[key] === "object") {
              treatFilters(filters, q[key], keyField);
            } else if (q[key] != null) {
              const filter = {};

              if (typeof q[key] === "string") {
                filter[`${keyField}.keyword`] = q[key];
              } else {
                filter[keyField] = q[key];
              }

              filters.push({
                term: filter
              });
            }
          }

          return filters;
        };

        const filters = treatFilters([], query);
        const filter = {
          index: model.table,
          body: {
            query: {
              bool: {
                must: filters
              }
            }
          }
        };

        this.client.search(filter, (err, response, status) => {
          if (err) {
            reject(err);
          }

          if (response.hits && response.hits.hits) {
            resolve(response.hits.hits.map(item => item._source));
          }

          reject(response);
        });
      });
    };
  }
}

module.exports = Elasticsearch;
