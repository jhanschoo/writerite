/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'datasource-sql' {
  import { DataSource } from 'apollo-datasource';
  import type { KeyValueCache } from 'apollo-server-caching';
  import Knex from 'knex';
  declare module 'knex' {
    interface QueryBuilder<TRecord extends {} = any, TResult = any> {
      cache(ttl?: number): QueryBuilder<TRecord, TResult>;
    }
  }

  export class SQLDataSource<TContext = any, TRecord extends {} = any, TResult = any> extends DataSource<TContext> {
    constructor<TRecord extends {} = any, TResult = unknown[]>(knexConfig: Knex<TRecord, TResult>);
    constructor<SV extends {} = any>(knexConfig: Knex.Config<SV>);

    db: Knex<TRecord, TResult>;
    knex: Knex<TRecord, TResult>;
    context?: TContext;
    cache?: KeyValueStore;

    initialize(config: DataSourceConfig<TContext>): void;
  }
}