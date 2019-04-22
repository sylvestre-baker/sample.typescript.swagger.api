import { injectable, inject } from 'inversify';
import { TYPES } from '../../../common';
import { MongoDBClient } from '../../../database';
import { ModelGodchild } from '../../models/index';
const CodeGenerator = require('node-code-generator');
const generator = new CodeGenerator();

@injectable()
export class StoreGodchild {
    private collectionName: string;
    constructor(
        @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
    ) {
        this.collectionName = 'Godchild';
    }

    create(userEmail: string, userId: string, godfatherCode: string, code: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>(async (resolve) => {
            const godchild = new ModelGodchild();
            godchild.godfatherCode = godfatherCode;
            godchild.userEmail = userEmail;
            godchild.userId = userId;
            godchild.code = code;
            this.mongoClient.insert(this.collectionName, godchild, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    getAll(): Promise<ModelGodchild[]> {
        return new Promise<ModelGodchild[]>((resolve) => {
            this.mongoClient.find(this.collectionName, {}, (error, data: ModelGodchild[]) => {
                resolve(data);
            });
        });
    }

    get(id: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>((resolve) => {
            this.mongoClient.findOneById(this.collectionName, id, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    getByEmail(userEmail: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { userEmail: userEmail }, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    getByCode(code: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { code: code }, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    getByGodfatherCode(godfatherCode: string): Promise<ModelGodchild[]> {
        return new Promise<ModelGodchild[]>((resolve) => {
            this.mongoClient.find(this.collectionName, { godfatherCode: godfatherCode }, (error, data: ModelGodchild[]) => {
                resolve(data);
            });
        });
    }

    getByUserId(userId: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { userId: userId }, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    getByUserIdAndCode(userId: string, code: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { userId: userId, code: code }, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    editUserEmail(id: string, userEmail: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>(async (resolve) => {
            const user = await this.get(id);
            user.userEmail = userEmail;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }

    editUserEmailByCode(code: string, userEmail: string): Promise<ModelGodchild> {
        return new Promise<ModelGodchild>(async (resolve) => {
            const user = await this.getByCode(code);
            user.userEmail = userEmail;
            this.mongoClient.update(this.collectionName, user._id.toString(), user, (error, data: ModelGodchild) => {
                resolve(data);
            });
        });
    }
}