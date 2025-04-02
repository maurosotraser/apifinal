import { pool } from '../config/database';
import { Request } from 'mssql';
import * as sql from 'mssql';

export class BaseService {
  protected async getRequest(): Promise<Request> {
    return pool.request();
  }

  protected async executeQuery<T>(query: string, params: Record<string, any> = {}): Promise<T[]> {
    const request = await this.getRequest();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.recordset;
  }

  protected async executeStoredProcedure<T>(
    procedureName: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    const request = await this.getRequest();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.execute(procedureName);
    return result.recordset;
  }

  protected async executeTransaction<T>(
    queries: { query: string; params?: Record<string, any> }[]
  ): Promise<T[]> {
    const transaction = new sql.Transaction(pool);
    const results: T[] = [];

    try {
      for (const { query, params } of queries) {
        const request = transaction.request();
        
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            request.input(key, value);
          });
        }

        const result = await request.query(query);
        results.push(...result.recordset);
      }

      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
} 