import { injectable, inject } from 'inversify';
import { TYPES } from '../../../common';
import { MongoDBClient } from '../../../database';
import { ModelUser, ModelGender, ModelAddress } from '../../models/index';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';
@injectable()
export class StoreUserAdmin {
    private collectionName: string;
    private saltRounds: number;
    constructor(
        @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
    ) {
        this.collectionName = 'UserAdmin';
        this.saltRounds = 10;
    }

    create(firstname: string, lastname: string, email: string, password: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = new ModelUser();
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.password = await bcrypt.hash(password, this.saltRounds);
            this.mongoClient.insert(this.collectionName, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    getAll(): Promise<ModelUser[]> {
        return new Promise<ModelUser[]>((resolve) => {
            this.mongoClient.find(this.collectionName, {}, (error, data: ModelUser[]) => {
                resolve(data);
            });
        });
    }

    get(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve) => {
            this.mongoClient.findOneById(this.collectionName, id, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    getByEmail(email: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { email: email }, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    getByEmailVerificationId(emailVerificationId: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { emailVerificationId: emailVerificationId }, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    edit(id: string, firstname: string, lastname: string,gender: ModelGender): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.firstname = firstname;
            user.lastname = lastname;
            user.gender = gender;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    setAccessToken(id: string, accessToken: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.accessToken = accessToken;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    setEmailVerificationId(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.emailVerificationId = this.generateId(50);
            user.emailVerified = false;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    setEmailVerified(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.emailVerified = true;
            user.emailVerificationId = null;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    setEnable(id: string, enable: boolean): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.enable = enable;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    editPassword(id: string, password: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.oldPasswords.push(user.password);
            user.password = await bcrypt.hash(password, this.saltRounds);
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });

        });
    }

    checkPasswordExist(id: string, password: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            const user = await this.get(id);
            const exist = await bcrypt.compare(password, user.password);
            if (exist)
                resolve(true);
            else {
                for (let index = 0; index < user.oldPasswords.length; index++) {
                    const oldPassword = user.oldPasswords[index];
                    const exist = await bcrypt.compare(password, oldPassword)
                    if (exist)
                        resolve(true);
                }
                resolve(false)
            }
        });
    }


    editEmail(id: string, email: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.email = email;
            user.emailVerified = false;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    delete(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            this.mongoClient.remove(this.collectionName, id, (error, data) => {
                if (data)
                    resolve(true);
                else
                    resolve(false);
            })
        });
    }

    private generateId(count): string {
        const _sym: string = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let str: string = '';

        for (var i = 0; i < count; i++) {
            str += _sym[Math.floor((Math.random() * (_sym.length)))];
        }

        return str;
    }
}