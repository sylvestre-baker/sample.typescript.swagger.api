import { injectable, inject } from 'inversify';
import { TYPES } from '../../../common';
import { MongoDBClient } from '../../../database';
import { ModelUser, ModelGender, ModelAddress, ModelPushOneSignal } from '../../models/index';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';
@injectable()
export class StoreUser {
    private collectionName: string;
    private saltRounds: number;
    constructor(
        @inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient
    ) {
        this.collectionName = 'User';
        this.saltRounds = 10;
    }

    create(firstname: string, lastname: string, email: string, password: string, birthDate: string,
        photoUrl: string, facebookId: string, facebookAccessToken: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = new ModelUser();
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.birthDate = birthDate;
            user.photoUrl = photoUrl;
            user.password = await bcrypt.hash(password, this.saltRounds);
            user.facebookId = facebookId;
            user.facebookAccessToken = facebookAccessToken;
            this.mongoClient.insert(this.collectionName, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    getAll(): Promise<ModelUser[]> {
        return new Promise<ModelUser[]>((resolve, reject) => {
            this.mongoClient.find(this.collectionName, {}, (error, data: ModelUser[]) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    get(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve, reject) => {
            this.mongoClient.findOneById(this.collectionName, id, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    getByEmail(email: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve, reject) => {
            this.mongoClient.findOneByFilter(this.collectionName, { email: email }, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    getByPasswordVerificationId(passwordVerificationId: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve) => {
            this.mongoClient.findOneByFilter(this.collectionName, { passwordVerificationId: passwordVerificationId }, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }
    
    getByGodfatherCode(godfatherCode: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve, reject) => {
            this.mongoClient.findOneByFilter(this.collectionName, { godfatherCode: godfatherCode }, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    getByEmailVerificationId(emailVerificationId: string): Promise<ModelUser> {
        return new Promise<ModelUser>((resolve, reject) => {
            this.mongoClient.findOneByFilter(this.collectionName, { emailVerificationId: emailVerificationId }, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    edit(id: string, firstname: string, lastname: string, birthDate: string, phoneNumber: string, gender: ModelGender,
        address: ModelAddress, photoUrl: string, mobileToken: string,
        facebookId: string, facebookAccessToken: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.firstname = firstname;
            user.lastname = lastname;
            user.birthDate = birthDate;
            user.phoneNumber = phoneNumber;
            user.gender = gender;
            user.address = address;
            user.photoUrl = photoUrl;
            user.mobileToken = mobileToken;
            user.facebookId = facebookId;
            user.facebookAccessToken = facebookAccessToken;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setAccessToken(id: string, accessToken: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.accessToken = accessToken;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setFacebookInfos(id: string, facebookId: string, facebookAccessToken: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.facebookId = facebookId;
            user.facebookAccessToken = facebookAccessToken;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setEmailVerificationId(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.emailVerificationId = this.generateId(50);
            user.emailVerified = false;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setMobileToken(id: string, mobileToken: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.mobileToken = mobileToken;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setEmailVerified(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.emailVerified = true;
            user.emailVerificationId = null;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setEnable(id: string, enable: boolean): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.enable = enable;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    setGodfatherCode(id: string, godfatherCode: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.godfatherCode = godfatherCode;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }

    editPassword(id: string, password: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.oldPasswords.push(user.password);
            user.password = await bcrypt.hash(password, this.saltRounds);
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });

        });
    }


    checkPasswordExist(id: string, password: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
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
        return new Promise<ModelUser>(async (resolve, reject) => {
            const user = await this.get(id);
            user.email = email;
            user.emailVerified = false;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    }



    delete(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.mongoClient.remove(this.collectionName, id, (error, data) => {
                if (error)
                    reject(error);
                else if (data)
                    resolve(true);
                else
                    resolve(false);
            })
        });
    }

    setPasswordVerificationId(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.passwordVerificationId = this.generateId(50);
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                resolve(data);
            });
        });
    }

    generatePassword(id: string): Promise<ModelUser> {
        return new Promise<ModelUser>(async (resolve) => {
            const user = await this.get(id);
            user.oldPasswords.push(user.password);
            let password = generator.generate({
                length: 15,
                numbers: true,
                symbols: false,
                excludeSimilarCharacters: true
            })
            password += this.generateSymbols(3);
            user.password = await bcrypt.hash(password, this.saltRounds);
            user.passwordVerificationId = null;
            this.mongoClient.update(this.collectionName, id, user, (error, data: ModelUser) => {
                data.password = password;
                resolve(data);
            });

        });

    }

    private generateSymbols(count): string {
        const _sym: string = '$@$!%*#?&';
        let str: string = '';

        for (var i = 0; i < count; i++) {
            str += _sym[Math.floor((Math.random() * (_sym.length)))];
        }

        return str;
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