
import { injectable, inject } from 'inversify';
import {
    ModelAddress,
    ModelGender,
    CreateUserRequest,
    UserResponse,
    FindUserByIdRequest,
    FindUserByEmailRequest,
    EditUserRequest,
    EditUserPasswordRequest,
    EditUserEmailRequest,
    EditUserFacebookInformationsRequest,
    EditUserMobileTokensRequest,
    FindUserByEmailVerificationIdRequest,
    EditUserPhotoByIdRequest
} from '../models'

import { ObjectID } from 'mongodb';


import { TYPES } from '../../../modules/common';
import {
    StoreUser,
} from './stores';
import {

} from '../models';
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';
import { resolve } from 'url';
import { StoreGodfather, StoreGodchild } from '../../godfathers/index';

@injectable()
export class ServiceUser {
    private smtpTransport = null;
    constructor(
        @inject(TYPES.StoreUser) private store: StoreUser,
        @inject(TYPES.StoreGodfather) private storeGodfather: StoreGodfather,
        @inject(TYPES.StoreGodchild) private storeGodchild: StoreGodchild,

    ) {
        this.smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "noreply.cloudbakers.io@gmail.com",
                pass: "Azerty01!"
            }
        });
    }

    async create(newUser: CreateUserRequest, host: string): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.getByEmail(newUser.email);
        if (user) {
            userResponse.message = `User with this email ${newUser.email} already exists`;
            userResponse.success = false;
            userResponse.code = -1;
            userResponse.user = null;
            return userResponse;
        }

        else {
            user = await this.store.create(newUser.firstname, newUser.lastname, newUser.email,
                newUser.password, newUser.photoUrl, newUser.facebookId, newUser.facebookAccessToken);

            if (user) {
                const godfather = await this.storeGodfather.create(user.email, user._id.toString());
                user = await this.store.setGodfatherCode(user._id.toString(), godfather.code);
                const findUser: FindUserByIdRequest = new FindUserByIdRequest();
                findUser.userId = user._id.toString();
                const email = await this.sendEmailVerification(findUser, host);
                if (email.success == false)
                    return email;
                else {
                    userResponse.message = `User with this email ${newUser.email} created successfully`;
                    userResponse.success = true;
                    userResponse.code = 1;
                    userResponse.user = user;
                    delete userResponse.user.password;
                    delete userResponse.user.oldPasswords;
                    delete userResponse.user.accessToken;
                    delete user.emailVerificationId;
                    return userResponse;
                }
            }
            else {
                return null;
            }
        }

    }

    async find(findUser: FindUserByIdRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        const user = await this.store.get(findUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${findUser.userId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -3;
            return userResponse;
        }
        else {
            userResponse.message = `User with this id ${findUser.userId} found`;
            userResponse.success = true;
            userResponse.user = user;
            userResponse.code = 1;
            delete userResponse.user.password;
            delete userResponse.user.oldPasswords;
            delete userResponse.user.accessToken;
            delete user.emailVerificationId;
            return userResponse;
        }
    }

    async findByEmail(findUser: FindUserByEmailRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        const user = await this.store.getByEmail(findUser.email);
        if (!user) {
            userResponse.message = `User with this email ${findUser.email} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -1;
            return userResponse;
        }
        else {
            userResponse.message = `User with this email ${findUser.email} found`;
            userResponse.success = true;
            userResponse.user = user;
            userResponse.code = 1;
            delete userResponse.user.password;
            delete userResponse.user.oldPasswords;
            delete userResponse.user.accessToken;
            delete user.emailVerificationId;
            return userResponse;
        }
    }

    async userWithEmailExist(findUser: FindUserByEmailRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        const user = await this.store.getByEmail(findUser.email);
        if (!user) {
            userResponse.message = `User with this email ${findUser.email} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -1;
            return userResponse;
        }
        else {
            userResponse.message = `User with this email ${findUser.email} found`;
            userResponse.success = true;
            userResponse.code = 1;
            delete userResponse.user;
            return userResponse;
        }
    }

    async update(editUser: EditUserRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.get(editUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${editUser.userId} not found`;
            userResponse.success = false;
            userResponse.code = -3;
            userResponse.user = null;
            return userResponse;
        }
        else {
            const gender: ModelGender = editUser.gender == 'male' ? ModelGender.male : ModelGender.female;
            const address: ModelAddress = new ModelAddress();
            address.address = editUser.address;
            address.country = editUser.country;
            address.state = editUser.state;
            address.city = editUser.city;
            user = await this.store.edit(editUser.userId, editUser.firstname, editUser.lastname, editUser.phoneNumber,
                gender, address, editUser.photoUrl, editUser.mobileToken, editUser.facebookId, editUser.facebookAccessToken);
            if (user) {
                userResponse.message = `User with this id ${editUser.userId} edited`;
                userResponse.success = true;
                userResponse.user = user;
                userResponse.code = 1;
                delete userResponse.user.password;
                delete userResponse.user.oldPasswords;
                delete userResponse.user.accessToken;
                delete user.emailVerificationId;
                return userResponse;
            }
            else
                return null;
        }
    }

    async remove(removeUser: FindUserByIdRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.get(removeUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${removeUser.userId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -3;
            return userResponse;
        }
        else {
            const removed = await this.store.delete(removeUser.userId)
            if (removed) {
                userResponse.message = `User with this id ${removeUser.userId} removed`;
                userResponse.success = true;
                userResponse.code = 1;
                userResponse.user = null;
            }
            else {
                userResponse.message = `User with this id ${removeUser.userId} cannot be removed`;
                userResponse.success = false;
                userResponse.code = -3;
                userResponse.user = null;
            }
            return userResponse;
        }
    }


    async editPassword(editUser: EditUserPasswordRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.get(editUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${editUser.userId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -3;
            return userResponse;
        }
        else {
            const passwordExist = await this.store.checkPasswordExist(editUser.userId, editUser.password);
            if (passwordExist) {
                userResponse.message = `User with this id ${editUser.userId} has already this password`;
                userResponse.success = false;
                userResponse.user = null;
                userResponse.code = -2;
                return userResponse;
            }
            else {
                user = await this.store.editPassword(editUser.userId, editUser.password);
                if (user) {
                    userResponse.message = `User with this id ${editUser.userId} password changed`;
                    userResponse.success = true;
                    userResponse.user = user;
                    userResponse.code = 1;
                    delete userResponse.user.password;
                    delete userResponse.user.oldPasswords;
                    delete userResponse.user.accessToken;
                    delete user.emailVerificationId;
                    return userResponse;
                }
                else
                    return null;
            }
        }
    }



    async editEmail(editUser: EditUserEmailRequest, host: string): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.get(editUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${editUser.userId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -3;
            return userResponse;
        }
        else {
            user = await this.store.editEmail(editUser.userId, editUser.email);
            const findUser: FindUserByIdRequest = new FindUserByIdRequest();
            findUser.userId = editUser.userId;
            const email = await this.sendEmailVerification(findUser, host);
            if (email.success == false)
                return email;
            else {
                if (user) {
                    await this.storeGodfather.editUserEmailByCode(user.godfatherCode, user.email);
                    await this.storeGodchild.editUserEmailByCode(user.godfatherCode, user.email);
                    userResponse.message = `User with this id ${editUser.userId} email changed`;
                    userResponse.success = true;
                    userResponse.user = user;
                    userResponse.code = 1;
                    delete userResponse.user.password;
                    delete userResponse.user.oldPasswords;
                    delete userResponse.user.accessToken;
                    delete user.emailVerificationId;
                    return userResponse;
                }
                else
                    return null;
            }
        }
    }

    async setFacebookInfos(editUser: EditUserFacebookInformationsRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.get(editUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${editUser.userId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -3;
            return userResponse;
        }
        else {
            user = await this.store.setFacebookInfos(editUser.userId,
                editUser.facebookId, editUser.facebookAccessToken);
            if (user) {
                userResponse.message = `User with this id ${editUser.userId} facebook informations changed`;
                userResponse.success = true;
                userResponse.user = user;
                userResponse.code = 1;
                delete userResponse.user.password;
                delete userResponse.user.oldPasswords;
                delete userResponse.user.accessToken;
                delete user.emailVerificationId;
                return userResponse;
            }
            else
                return null;
        }
    }

    async setMobileToken(editUser: EditUserMobileTokensRequest): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.get(editUser.userId);
        if (!user) {
            userResponse.message = `User with this id ${editUser.userId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -3;
            return userResponse;
        }
        else {
            user = await this.store.setMobileToken(editUser.userId,
                editUser.mobileToken);
            if (user) {
                userResponse.message = `User with this id ${editUser.userId} mobile token informations changed`;
                userResponse.success = true;
                userResponse.user = user;
                userResponse.code = 1;
                delete userResponse.user.password;
                delete userResponse.user.oldPasswords;
                delete userResponse.user.accessToken;
                delete user.emailVerificationId;
                return userResponse;
            }
            else
                return null;
        }
    }

    async sendEmailVerification(findUser: FindUserByIdRequest, host: string): Promise<UserResponse> {
        return new Promise<UserResponse>(async (resolve) => {
            const userResponse = new UserResponse();
            let user = await this.store.get(findUser.userId);
            if (!user) {
                userResponse.message = `User with this id ${findUser.userId} not found`;
                userResponse.success = false;
                userResponse.user = null;
                userResponse.code = -3;
                resolve(userResponse);
            }
            else {
                user = await this.store.setEmailVerificationId(findUser.userId);
                const link = "http://" + host + "/auth/verify?id=" + user.emailVerificationId;
                const mailOptions = {
                    to: user.email,
                    subject: "Please confirm your Email account",
                    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                }
                this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                    if (error) {
                        userResponse.message = `User with this id ${findUser.userId} verification email not sent`;
                        userResponse.success = false;
                        userResponse.user = user;
                        userResponse.code = -4;
                        delete userResponse.user.password;
                        delete userResponse.user.oldPasswords;
                        delete userResponse.user.accessToken;
                        delete user.emailVerificationId;
                        resolve(userResponse);
                    } else {

                        userResponse.message = `User with this id ${findUser.userId} verification email sent`;
                        userResponse.success = true;
                        userResponse.user = user;
                        userResponse.code = 1;
                        delete userResponse.user.password;
                        delete userResponse.user.oldPasswords;
                        delete userResponse.user.accessToken;
                        delete user.emailVerificationId;
                        resolve(userResponse);

                    }
                });
            }
        });
    }

    async verifyEmail(findUser: FindUserByEmailVerificationIdRequest, host: string): Promise<UserResponse> {
        const userResponse = new UserResponse();
        let user = await this.store.getByEmailVerificationId(findUser.emailVerificationId);
        if (!user) {
            userResponse.message = `User with this emailVerificationId ${findUser.emailVerificationId} not found`;
            userResponse.success = false;
            userResponse.user = null;
            userResponse.code = -5;
            return userResponse;
        }
        else {
            user = await this.store.setEmailVerified(user._id.toString());
            if (user) {
                userResponse.message = `User with this emailVerificationId ${findUser.emailVerificationId} verified`;
                userResponse.success = true;
                userResponse.user = user;
                userResponse.code = 1;
                delete userResponse.user.password;
                delete userResponse.user.oldPasswords;
                delete userResponse.user.accessToken;
                delete user.emailVerificationId;
                return userResponse;
            }
            else
                return null;
        }
    }
}