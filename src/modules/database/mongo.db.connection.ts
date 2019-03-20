import { Db, MongoClient } from 'mongodb';
export class MongoDBConnection {
  private static isConnected: boolean = false;
  private static db: Db;

  public static getConnection(url: string, result: (connection) => void) {
      
    if (this.isConnected) {
      return result(this.db);
    } else {
      this.connect(url, (error, db: Db) => {
        return result(this.db);
      });
    }
  }

  private static connect(url : string, result: (error, db: Db) => void) {
    MongoClient.connect(url, (error, db: Db) => {
      this.db = db;
      this.isConnected = true;
      console.log(`connected to mongodb : ${url}`);
      return result(error, db);
    });
  }
}