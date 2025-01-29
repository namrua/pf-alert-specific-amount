import { createClient } from "@clickhouse/client";
import { QueryParams } from "./Queries";
export const clickhouse = createClient({
  url: 'https://zp8gub83b7.ap-southeast-1.aws.clickhouse.cloud:8443',
  username: 'default',
  password: 'e_6vg8G_DfsDz',
  database: "BCE",
  clickhouse_settings: {
    connect_timeout: 100,
  },
});

export class ClickHouseService {
  public static async query<T>(query: string, params: QueryParams): Promise<T> {
    try {
      const formattedQuery = this.formatQuery(query, params);
      const rows = await clickhouse.query({
        query: formattedQuery,
        format: "JSONEachRow",
      });
      const result = await rows.json<T>();
      return result[0];
    } catch (error) {
      console.error("Query execution failed", error);
      throw error;
    }
  }

  public static async queryMany<T>(query: string, params: QueryParams): Promise<T[] | null> {
    try {
      const formattedQuery = this.formatQuery(query, params);
      const rows = await clickhouse.query({
        query: formattedQuery,
        format: "JSONEachRow",
      });
      const result = await rows.json<T>();
      return result;
    } catch (error) {
      console.error("Query execution failed", error);
      throw error;
    }
  }

  public static formatQuery(query: string, params: QueryParams): string {
    return query.replace(/{(\w+)}/g, (_, key) => {
      if (key in params) {
        const value = params[key];
        return value?.toString();
      }
      return `{${key}}`;
    });
  }
}

