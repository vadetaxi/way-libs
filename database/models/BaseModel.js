class BaseModel {
    constructor(table, datasource) {
        if (!table) {
            throw new Error('table is not defined');
        }

        if (!datasource) {
            throw new Error('datasource is not defined');
        }

        this.setTable(table);
        this.setDataSouce(datasource);
    }

    setDataSouce(datasource) {
        datasource.initialize(this);
    }

    setTable(table) {
        this.table = table;
    }

    setPrimaryKey(pk) {
        this.pk = pk || 'id';
    }
}

module.exports = BaseModel;