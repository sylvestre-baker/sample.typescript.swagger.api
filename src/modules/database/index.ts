export * from './services';
export * from './mongo.db.connection';

import { Container } from 'inversify';
import { MongoDBClient } from './services';
import { TYPES } from '../../modules/common';


export function configureDatabase(config: { mongodb: string }, container: Container) {
    const mongo = new MongoDBClient(config.mongodb);
    container.bind<MongoDBClient>(TYPES.MongoDBClient).toConstantValue(mongo);
}