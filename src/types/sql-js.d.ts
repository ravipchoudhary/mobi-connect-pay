declare module "sql.js" {
  export interface SqlJsStatic {
    Database: new (...args: any[]) => Database;
  }

  export interface Database {
    run(sql: string, params?: any[]): void;
    prepare(sql: string): Statement;
    export(): Uint8Array;
  }

  export interface Statement {
    bind(params: any[]): void;
    step(): boolean;
    getAsObject(): Record<string, any>;
    free(): void;
  }

  const initSqlJs: (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;
  export default initSqlJs;
}
