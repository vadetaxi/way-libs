declare namespace waylibs {
    namespace database {
        class BaseModel {
            constructor(...args: any[]);

            setDataSouce(...args: any[]): void;

            setPrimaryKey(...args: any[]): void;

            setTable(...args: any[]): void;

        }

        class Crypt {
            constructor(...args: any[]);

            decrypt(...args: any[]): void;

            encrypt(...args: any[]): void;

        }

        namespace Drivers {
            class Elasticsearch {
                constructor(...args: any[]);

                count(...args: any[]): void;

                deleteById(...args: any[]): void;

                find(...args: any[]): void;

                initialize(...args: any[]): void;

                insert(...args: any[]): void;

                updateById(...args: any[]): void;

            }

            class Http {
                constructor(...args: any[]);

                initialize(...args: any[]): void;

            }

            class Mysql {
                constructor(...args: any[]);

                deleteById(...args: any[]): void;

                find(...args: any[]): void;

                findById(...args: any[]): void;

                initialize(...args: any[]): void;

                insert(...args: any[]): void;

                insertMany(...args: any[]): void;

                startTransaction(...args: any[]): void;

                update(...args: any[]): void;

                updateById(...args: any[]): void;

            }

            class Redis {
                constructor(...args: any[]);

                initialize(...args: any[]): void;

            }


        }

    }

    function logger(config: any): any;

    namespace middlewares {
        function error404(req: any, res: any, next: any): void;

        function errors(err: any, req: any, res: any, next: any): void;

        function loggerRequests(loggerFunction: any, extractRequest: any): any;
    }

    namespace request {
        class validate {
            constructor(...args: any[]);
            body(schema: any): any;

            headers(schema: any): any;

            params(schema: any, name: any): any;

            query(schema: any): any;

            validate(schema: any): any;
        }
    }


    namespace utils {
        function date(pattern: any): any;

        function deepFreeze(object: any): any;

    }
}
export = waylibs