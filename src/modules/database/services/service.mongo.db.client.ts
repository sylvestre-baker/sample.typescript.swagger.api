import { Db, ObjectID } from 'mongodb';
import { injectable } from 'inversify';
import { MongoDBConnection } from '../mongo.db.connection';
import * as mongo from 'mongodb';

@injectable()
export class MongoDBClient {
  public db: Db;
  private pageSize: number;

  constructor(mongodb) {
    MongoDBConnection.getConnection(mongodb, (connection) => {
      this.db = connection;
      this.pageSize = 100;
    });
  }

  public find(collection: string, filter: Object, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).toArray((error, find) => {
      return result(error, find);
    });
  }

  public findWithLimit(collection: string, filter: Object, limit: number, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).limit(limit).toArray((error, find) => {
      return result(error, find);
    });
  }

  public findWithLimitAndSkip(collection: string, filter: Object, limit: number, skip: number, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).skip(skip).limit(limit).toArray((error, find) => {
      return result(error, find);
    });
  }

  public findPage(collection: string, filter: Object, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).limit(this.pageSize).toArray((error, find) => {
      return result(error, find);
    });
  }

  public findOneById(collection: string, objectId: string, result: (error, data) => void): void {
    this.db.collection(collection).findOne({ _id: new ObjectID(objectId) }, (error, find) => {
      return result(error, find);
    });
  }

  public findOneByFilter(collection: string, filter: object, result: (error, data) => void): void {
    this.db.collection(collection).findOne(filter, (error, find) => {
      return result(error, find);
    });
  }

  public insert(collection: string, model: Object, result: (error, data) => void): void {
    this.db.collection(collection).insertOne(model, (error, insert) => {
      return result(error, insert.ops[0]);
    });
  }

  public update(collection: string, objectId: string, model: Object, result: (error, data) => void): void {
    this.db.collection(collection).updateOne({ _id: new ObjectID(objectId) }, { $set: model }, (error, update) => {
      return result(error, model);
    });
  }

  public updateByFilter(collection: string, filter: object, model: Object, result: (error, data) => void): void {
    this.db.collection(collection).updateOne(filter, { $set: model }, (error, update) => {
      return result(error, model);
    });
  }

  public remove(collection: string, objectId: string, result: (error, data) => void): void {
    this.db.collection(collection).deleteOne({ _id: new ObjectID(objectId) }, (error, remove) => {
      return result(error, remove);
    });
  }

  public removeByFilter(collection: string, filter: object, result: (error, data) => void): void {
    this.db.collection(collection).deleteOne(filter, (error, remove) => {
      return result(error, remove);
    });
  }

  public getLastRecord(collection: string, result: (error, data) => void): void {
    this.db.collection(collection).find().sort({ _id: -1 }).limit(1).toArray((error, find) => {
      if (find)
        return result(error, find[0]);
      else
        return result(error, find);
    });
  }

  public getLastRecordByFilter(collection: string, filter: Object, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).sort({ _id: -1 }).limit(1).toArray((error, find) => {
      if (find)
        return result(error, find[0]);
      else
        return result(error, find);
    });
  }

  public getLastRecordBySortByFilter(collection: string, filter: Object, sortField: object, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).sort(sortField).limit(1).toArray((error, find) => {
      if (find)
        return result(error, find[0]);
      else
        return result(error, find);
    });
  }

  public getLastRecordsByFilterWithLimit(collection: string, filter: Object, limit: number, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).sort({ _id: -1 }).limit(limit).toArray((error, find) => {
      return result(error, find);
    });
  }

  public getLastRecordsByFilterWithLimitAndSkip(collection: string, filter: Object, limit: number, skip: number, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).sort({ _id: -1 }).skip(skip).limit(limit).toArray((error, find) => {
      return result(error, find);
    });
  }

  public getFirstRecordByFilter(collection: string, filter: Object, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).sort({ _id: 1 }).limit(1).toArray((error, find) => {
      if (find)
        return result(error, find[0]);
      else
        return result(error, find);
    });
  }

  public getFirstRecordBySortByFilter(collection: string, filter: Object, sortField: object, result: (error, data) => void): void {
    this.db.collection(collection).find(filter).sort(sortField).limit(1).toArray((error, find) => {
      if (find)
        return result(error, find[0]);
      else
        return result(error, find);
    });
  }

  public count(collection: string, filter: Object, result: (error, data) => void): void {
    this.db.collection(collection).count(filter, (error, find) => {
      return result(error, find);
    });
  }

}