
import { injectable, inject } from 'inversify';
import {
    ModelAddress,
    ModelGender,
    CreateUserRequest,
    FindUserByIdRequest,
    FindUserByEmailRequest,
    EditUserRequest,
    EditUserPasswordRequest,
    EditUserEmailRequest,
    EditUserFacebookInformationsRequest,
    EditUserMobileTokensRequest,
    FindUserByEmailVerificationIdRequest,
    FindUserByPasswordVerificationIdRequest
} from '../models'

import { ObjectID } from 'mongodb';

import * as  jwt from 'jsonwebtoken';
import configAuth from '../../auth/models/config.auth';

import * as bcrypt from 'bcrypt';


import { TYPES, ResponseFailure, ResponseSuccess, ResponseError } from '../../../modules/common';

import {

} from '../models';
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';
import { resolve } from 'url';
import { IModelResponse } from '../../interfaces/api/index';
import { StoreUser } from './stores/index';

@injectable()
export class ServiceUser {
    private smtpTransport = null;
    constructor(
        @inject(TYPES.StoreUser) private store: StoreUser

    ) {
        this.smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "noreply.cloudbakers.io@gmail.com",
                pass: "Azerty01!"
            }
        });
    }

    async create(newUser: CreateUserRequest, host: string): Promise<IModelResponse> {
        try {
            let user = await this.store.getByEmail(newUser.email);
            if (user) {
                return ResponseFailure(400, `User with this email ${newUser.email.toLowerCase()} already exists`)
            }

            else {
                user = await this.store.create(newUser.firstname, newUser.lastname, newUser.email,
                    newUser.password, newUser.birthDate, newUser.photoUrl, newUser.facebookId, newUser.facebookAccessToken);

                const findUser: FindUserByIdRequest = new FindUserByIdRequest();
                findUser.userId = user._id.toString();
                await this.sendEmailVerification(findUser, host);

                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(201, user);

            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async find(findUser: FindUserByIdRequest): Promise<IModelResponse> {
        try {
            const user = await this.store.get(findUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${findUser.userId} not found`)
            }
            else {
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async findByEmail(findUser: FindUserByEmailRequest): Promise<IModelResponse> {
        try {
            const user = await this.store.getByEmail(findUser.email.toLowerCase());
            if (!user) {
                return ResponseFailure(400, `User with this email ${findUser.email.toLowerCase()} not found`)
            }
            else {
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async userWithEmailExist(findUser: FindUserByEmailRequest): Promise<IModelResponse> {
        try {
            const user = await this.store.getByEmail(findUser.email.toLowerCase());
            if (!user) {
                return ResponseSuccess(200, false);
            }
            else {
                return ResponseSuccess(200, true);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async update(editUser: EditUserRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {
                const address: ModelAddress = new ModelAddress();
                address.address = editUser.address;
                address.country = editUser.country;
                address.state = editUser.state;
                address.city = editUser.city;
                user = await this.store.edit(editUser.userId, editUser.firstname, editUser.lastname, editUser.birthDate, editUser.phoneNumber,
                    editUser.gender, address, editUser.photoUrl, editUser.mobileToken, editUser.facebookId, editUser.facebookAccessToken);
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async remove(removeUser: FindUserByIdRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(removeUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${removeUser.userId} not found`)
            }
            else {
                const removed = await this.store.delete(removeUser.userId)
                if (removed) {
                    return ResponseSuccess(200, true);
                }
                else {
                    ResponseSuccess(200, false);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async editPassword(editUser: EditUserPasswordRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {
                if (await bcrypt.compare(editUser.oldPassword, user.password) == false) {
                    return (ResponseFailure(400, `User with this id ${editUser.userId} bad password`))
                }
                else {
                    const passwordExist = await this.store.checkPasswordExist(editUser.userId, editUser.password);
                    if (passwordExist) {
                        return ResponseFailure(400, `User with this id ${editUser.userId} has already this password`)
                    }
                    else {
                        user = await this.store.editPassword(editUser.userId, editUser.password);
                        return ResponseSuccess(202, true);
                    }
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async editEmail(editUser: EditUserEmailRequest, host: string): Promise<IModelResponse> {
        try {
            editUser.email = editUser.email.toLowerCase();
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {
                user = await this.store.editEmail(editUser.userId, editUser.email);
                const findUser: FindUserByIdRequest = new FindUserByIdRequest();
                findUser.userId = editUser.userId;
                const email = await this.sendEmailVerification(findUser, host);
                return ResponseSuccess(202, true);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async setMobileToken(editUser: EditUserMobileTokensRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {
                user = await this.store.setMobileToken(editUser.userId,
                    editUser.mobileToken);
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async sendEmailVerification(findUser: FindUserByIdRequest, host: string): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve, reject) => {
            try {
                let user = await this.store.get(findUser.userId);
                if (!user) {
                    resolve(ResponseFailure(400, `User with this id ${findUser.userId} not found`));
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
                            reject(ResponseFailure(500, error));
                        } else {
                            resolve(ResponseSuccess(202, true));
                        }
                    });
                }
            }
            catch (error) {
                return ResponseFailure(500, error)
            }
        });
    }

    async verifyEmail(findUser: FindUserByEmailVerificationIdRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.getByEmailVerificationId(findUser.emailVerificationId);
            if (!user) {
                return ResponseFailure(400, `User with this emailVerificationId ${findUser.emailVerificationId} not found`);
            }
            else {
                user = await this.store.setEmailVerified(user._id.toString());
                return ResponseSuccess(200, true);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }



    async setFacebookInfos(editUser: EditUserFacebookInformationsRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {
                user = await this.store.setFacebookInfos(editUser.userId,
                    editUser.facebookId, editUser.facebookAccessToken);
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);

            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async sendPasswordVerification(findUser: FindUserByEmailRequest, host: string): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve) => {
            let user = await this.store.getByEmail(findUser.email);
            if (!user) {
                resolve(ResponseFailure(400, `User with this email ${findUser.email} not found`))
            }
            else {
                user = await this.store.setPasswordVerificationId(user._id.toString());
                const link = "http://" + host + "/auth/resetPassword?passwordVerificationId=" + user.passwordVerificationId;
                const mailOptions = {
                    from: 'noreply@pyxitrack.com',
                    to: user.email,
                    subject: "Reset password",
                    html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to generate password</a>"
                }
                this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                    if (error) {
                        resolve(ResponseFailure(400, `User with this email ${findUser.email} password reset not sent`))
                    } else {
                        resolve(ResponseSuccess(200, `User with this email ${findUser.email} password reset sent`));
                    }
                });
            }
        });
    }


    async generatePassword(editUser: FindUserByPasswordVerificationIdRequest): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve) => {
            let user = await this.store.getByPasswordVerificationId(editUser.passwordVerificationId);
            if (!user) {
                resolve(ResponseFailure(400, `User with this passwordVerificationId ${editUser.passwordVerificationId} not found`));
            }
            else {

                user = await this.store.generatePassword(user._id.toString());
                console.log(user);
                if (user) {
                    const mailOptions = {
                        from: 'noreply@pyxitrack.com',
                        to: user.email,
                        subject: "New password",
                        html: "Hello,<br> your new password is : <br>" + user.password + "</a>"
                    }
                    this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                        if (error) {
                            resolve(ResponseFailure(400, `User with this email ${user.email} password reset not sent`))
                        } else {
                            resolve(ResponseSuccess(200, `User with this email ${user.email} password reset sent`));
                        }
                    });

                }
                else
                    resolve(null);
            }
        });
    }
}