
import { injectable, inject } from 'inversify';
import {
    ModelAddress,
    ModelGender,
    CreateUserAdminRequest,
    UserAdminResponse,
    FindUserAdminByIdRequest,
    FindUserAdminByEmailRequest,
    EditUserAdminRequest,
    EditUserAdminPasswordRequest,
    EditUserAdminEmailRequest,
    FindUserAdminByEmailVerificationIdRequest
} from '../models'

import { TYPES } from '../../../modules/common';
import {
    StoreUserAdmin,
} from './stores';
import {

} from '../models';
import * as nodemailer from "nodemailer";
import { resolve } from 'url';

@injectable()
export class ServiceUserAdmin {
    private smtpTransport = null;
    constructor(
        @inject(TYPES.StoreUserAdmin) private store: StoreUserAdmin,
    ) {
        this.smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                userAdmin: "noreply.cloudbakers.io@gmail.com",
                pass: "Azerty01!"
            }
        });
    }

    async create(newUserAdmin: CreateUserAdminRequest, host: string): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        let userAdmin = await this.store.getByEmail(newUserAdmin.email);
        if (userAdmin) {
            userAdminResponse.message = `UserAdmin with this email ${newUserAdmin.email} already exists`;
            userAdminResponse.success = false;
            userAdminResponse.code = -1;
            userAdminResponse.user = null;
            return userAdminResponse;
        }

        else {
            userAdmin = await this.store.create(newUserAdmin.firstname, newUserAdmin.lastname, newUserAdmin.email,
                newUserAdmin.password);

            if (userAdmin) {
                const findUserAdmin: FindUserAdminByIdRequest = new FindUserAdminByIdRequest();
                findUserAdmin.userId = userAdmin._id.toString();
                const email = await this.sendEmailVerification(findUserAdmin, host);
                if (email.success == false)
                    return email;
                else {
                    userAdminResponse.message = `UserAdmin with this email ${newUserAdmin.email} created successfully`;
                    userAdminResponse.success = true;
                    userAdminResponse.code = 1;
                    userAdminResponse.user = userAdmin;
                    delete userAdminResponse.user.password;
                    delete userAdminResponse.user.oldPasswords;
                    delete userAdminResponse.user.accessToken;
                    delete userAdmin.emailVerificationId;
                    return userAdminResponse;
                }
            }
            else {
                return null;
            }
        }

    }

    async find(findUserAdmin: FindUserAdminByIdRequest): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        const userAdmin = await this.store.get(findUserAdmin.userId);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this id ${findUserAdmin.userId} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -3;
            return userAdminResponse;
        }
        else {
            userAdminResponse.message = `UserAdmin with this id ${findUserAdmin.userId} found`;
            userAdminResponse.success = true;
            userAdminResponse.user = userAdmin;
            userAdminResponse.code = 1;
            delete userAdminResponse.user.password;
            delete userAdminResponse.user.oldPasswords;
            delete userAdminResponse.user.accessToken;
            delete userAdmin.emailVerificationId;
            return userAdminResponse;
        }
    }

    async findByEmail(findUserAdmin: FindUserAdminByEmailRequest): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        const userAdmin = await this.store.getByEmail(findUserAdmin.email);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this email ${findUserAdmin.email} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -1;
            return userAdminResponse;
        }
        else {
            userAdminResponse.message = `UserAdmin with this email ${findUserAdmin.email} found`;
            userAdminResponse.success = true;
            userAdminResponse.user = userAdmin;
            userAdminResponse.code = 1;
            delete userAdminResponse.user.password;
            delete userAdminResponse.user.oldPasswords;
            delete userAdminResponse.user.accessToken;
            delete userAdmin.emailVerificationId;
            return userAdminResponse;
        }
    }

    async userAdminWithEmailExist(findUserAdmin: FindUserAdminByEmailRequest): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        const userAdmin = await this.store.getByEmail(findUserAdmin.email);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this email ${findUserAdmin.email} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -1;
            return userAdminResponse;
        }
        else {
            userAdminResponse.message = `UserAdmin with this email ${findUserAdmin.email} found`;
            userAdminResponse.success = true;
            userAdminResponse.code = 1;
            delete userAdminResponse.user;
            return userAdminResponse;
        }
    }

    async update(editUserAdmin: EditUserAdminRequest): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        let userAdmin = await this.store.get(editUserAdmin.userId);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} not found`;
            userAdminResponse.success = false;
            userAdminResponse.code = -3;
            userAdminResponse.user = null;
            return userAdminResponse;
        }
        else {
            const gender: ModelGender = editUserAdmin.gender == 'male' ? ModelGender.male : ModelGender.female;
            userAdmin = await this.store.edit(editUserAdmin.userId, editUserAdmin.firstname, editUserAdmin.lastname, gender);
            if (userAdmin) {
                userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} edited`;
                userAdminResponse.success = true;
                userAdminResponse.user = userAdmin;
                userAdminResponse.code = 1;
                delete userAdminResponse.user.password;
                delete userAdminResponse.user.oldPasswords;
                delete userAdminResponse.user.accessToken;
                delete userAdmin.emailVerificationId;
                return userAdminResponse;
            }
            else
                return null;
        }
    }

    async remove(removeUserAdmin: FindUserAdminByIdRequest): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        let userAdmin = await this.store.get(removeUserAdmin.userId);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this id ${removeUserAdmin.userId} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -3;
            return userAdminResponse;
        }
        else {
            const removed = await this.store.delete(removeUserAdmin.userId)
            if (removed) {
                userAdminResponse.message = `UserAdmin with this id ${removeUserAdmin.userId} removed`;
                userAdminResponse.success = true;
                userAdminResponse.code = 1;
                userAdminResponse.user = null;
            }
            else {
                userAdminResponse.message = `UserAdmin with this id ${removeUserAdmin.userId} cannot be removed`;
                userAdminResponse.success = false;
                userAdminResponse.code = -3;
                userAdminResponse.user = null;
            }
            return userAdminResponse;
        }
    }


    async editPassword(editUserAdmin: EditUserAdminPasswordRequest): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        let userAdmin = await this.store.get(editUserAdmin.userId);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -3;
            return userAdminResponse;
        }
        else {
            const passwordExist = await this.store.checkPasswordExist(editUserAdmin.userId, editUserAdmin.password);
            if (passwordExist) {
                userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} has already this password`;
                userAdminResponse.success = false;
                userAdminResponse.user = null;
                userAdminResponse.code = -2;
                return userAdminResponse;
            }
            else {
                userAdmin = await this.store.editPassword(editUserAdmin.userId, editUserAdmin.password);
                if (userAdmin) {
                    userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} password changed`;
                    userAdminResponse.success = true;
                    userAdminResponse.user = userAdmin;
                    userAdminResponse.code = 1;
                    delete userAdminResponse.user.password;
                    delete userAdminResponse.user.oldPasswords;
                    delete userAdminResponse.user.accessToken;
                    delete userAdmin.emailVerificationId;
                    return userAdminResponse;
                }
                else
                    return null;
            }
        }
    }

    async editEmail(editUserAdmin: EditUserAdminEmailRequest, host: string): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        let userAdmin = await this.store.get(editUserAdmin.userId);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -3;
            return userAdminResponse;
        }
        else {
            userAdmin = await this.store.editEmail(editUserAdmin.userId, editUserAdmin.email);
            const findUserAdmin: FindUserAdminByIdRequest = new FindUserAdminByIdRequest();
            findUserAdmin.userId = editUserAdmin.userId;
            const email = await this.sendEmailVerification(findUserAdmin, host);
            if (email.success == false)
                return email;
            else {
                if (userAdmin) {
                    userAdminResponse.message = `UserAdmin with this id ${editUserAdmin.userId} email changed`;
                    userAdminResponse.success = true;
                    userAdminResponse.user = userAdmin;
                    userAdminResponse.code = 1;
                    delete userAdminResponse.user.password;
                    delete userAdminResponse.user.oldPasswords;
                    delete userAdminResponse.user.accessToken;
                    delete userAdmin.emailVerificationId;
                    return userAdminResponse;
                }
                else
                    return null;
            }
        }
    }


    async sendEmailVerification(findUserAdmin: FindUserAdminByIdRequest, host: string): Promise<UserAdminResponse> {
        return new Promise<UserAdminResponse>(async (resolve) => {
            const userAdminResponse = new UserAdminResponse();
            let userAdmin = await this.store.get(findUserAdmin.userId);
            if (!userAdmin) {
                userAdminResponse.message = `UserAdmin with this id ${findUserAdmin.userId} not found`;
                userAdminResponse.success = false;
                userAdminResponse.user = null;
                userAdminResponse.code = -3;
                resolve(userAdminResponse);
            }
            else {
                userAdmin = await this.store.setEmailVerificationId(findUserAdmin.userId);
                const link = "http://" + host + "/auth/verify?id=" + userAdmin.emailVerificationId;
                const mailOptions = {
                    to: userAdmin.email,
                    subject: "Please confirm your Email account",
                    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                }
                this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                    if (error) {
                        userAdminResponse.message = `UserAdmin with this id ${findUserAdmin.userId} verification email not sent`;
                        userAdminResponse.success = false;
                        userAdminResponse.user = userAdmin;
                        userAdminResponse.code = -4;
                        delete userAdminResponse.user.password;
                        delete userAdminResponse.user.oldPasswords;
                        delete userAdminResponse.user.accessToken;
                        delete userAdmin.emailVerificationId;
                        resolve(userAdminResponse);
                    } else {

                        userAdminResponse.message = `UserAdmin with this id ${findUserAdmin.userId} verification email sent`;
                        userAdminResponse.success = true;
                        userAdminResponse.user = userAdmin;
                        userAdminResponse.code = 1;
                        delete userAdminResponse.user.password;
                        delete userAdminResponse.user.oldPasswords;
                        delete userAdminResponse.user.accessToken;
                        delete userAdmin.emailVerificationId;
                        resolve(userAdminResponse);

                    }
                });
            }
        });
    }

    async verifyEmail(findUserAdmin: FindUserAdminByEmailVerificationIdRequest, host: string): Promise<UserAdminResponse> {
        const userAdminResponse = new UserAdminResponse();
        let userAdmin = await this.store.getByEmailVerificationId(findUserAdmin.emailVerificationId);
        if (!userAdmin) {
            userAdminResponse.message = `UserAdmin with this emailVerificationId ${findUserAdmin.emailVerificationId} not found`;
            userAdminResponse.success = false;
            userAdminResponse.user = null;
            userAdminResponse.code = -5;
            return userAdminResponse;
        }
        else {
            userAdmin = await this.store.setEmailVerified(userAdmin._id.toString());
            if (userAdmin) {
                userAdminResponse.message = `UserAdmin with this emailVerificationId ${findUserAdmin.emailVerificationId} verified`;
                userAdminResponse.success = true;
                userAdminResponse.user = userAdmin;
                userAdminResponse.code = 1;
                delete userAdminResponse.user.password;
                delete userAdminResponse.user.oldPasswords;
                delete userAdminResponse.user.accessToken;
                delete userAdmin.emailVerificationId;
                return userAdminResponse;
            }
            else
                return null;
        }
    }
}