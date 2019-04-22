import { injectable, inject } from 'inversify';
import { TYPES } from '../../../common';
import { MongoDBClient } from '../../../database';
import { ModelGodfather } from '../../models/index';
const CodeGenerator = require('node-code-generator');
const generator = new CodeGenerator();

@injectable()
export class StoreGodfather {
    private collectionName: string;
    constructor(
        @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
    ) {
        this.collectionName = 'Godfather';
    }

    create(userEmail: string, userId: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>(async (resolve) => {
            const godfather = new ModelGodfather();
            let codeExist = true;
            let code = null;
            do {
                const pattern = '******';
                const howMany = 2;
                const options = {};
                // Generate an array of random unique codes according to the provided pattern:
                const codes = generator.generateCodes(pattern, howMany, options);
                const godfatherExist = await this.getByCode(codes[0]);
                if (godfatherExist)
                    codeExist = true;
                else {
                    code = codes[0];
                    codeExist = false;
                }
            } while (codeExist);

            godfather.code = code;
            godfather.userEmail = userEmail;
            godfather.userId = userId;
            this.mongoClient.insert(this.collectionName, godfather, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    getAll(): Promise<ModelGodfather[]> {
        return new Promise<ModelGodfather[]>((resolve) => {
            this.mongoClient.find(this.collectionName, {}, (error, data: ModelGodfather[]) => {
                resolve(data);
            });
        });
    }

    get(id: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>((resolve) => {
            this.mongoClient.findOneById(this.collectionName, id, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    getByEmail(userEmail: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { userEmail: userEmail }, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    getByCode(code: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { code: code }, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    getByUserId(userId: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { userId: userId }, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    getByUserIdAndCode(userId: string, code: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { userId: userId, code: code }, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    editUserEmail(id: string, userEmail: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>(async (resolve) => {
            const user = await this.get(id);
            user.userEmail = userEmail;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }

    editUserEmailByCode(code: string, userEmail: string): Promise<ModelGodfather> {
        return new Promise<ModelGodfather>(async (resolve) => {
            const user = await this.getByCode(code);
            user.userEmail = userEmail;
            this.mongoClient.update(this.collectionName, user._id.toString(), user, (error, data: ModelGodfather) => {
                resolve(data);
            });
        });
    }
}