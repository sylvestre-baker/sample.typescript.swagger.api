
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

import { TYPES, ResponseFailure, ResponseSuccess } from '../../../modules/common';
import {
    StoreUserAdmin,
} from './stores';
import {

} from '../models';
import * as nodemailer from "nodemailer";
import { resolve } from 'url';
import { IModelResponse } from '../../interfaces/index';

@injectable()
export class ServiceUserAdmin {
    private smtpTransport = null;
    constructor(
        @inject(TYPES.StoreUserAdmin) private store: StoreUserAdmin,
    ) {
        this.smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "noreply.cloudbakers.io@gmail.com",
                pass: "Azerty01!"
            }
        });
    }

    async create(newUserAdmin: CreateUserAdminRequest, host: string): Promise<IModelResponse> {
        try {
            let userAdmin = await this.store.getByEmail(newUserAdmin.email);
            if (userAdmin) {
                return ResponseFailure(400, `UserAdmin with this email ${newUserAdmin.email} already exists`);
            }

            else {
                userAdmin = await this.store.create(newUserAdmin.firstname, newUserAdmin.lastname, newUserAdmin.email,
                    newUserAdmin.password);
                const findUserAdmin: FindUserAdminByIdRequest = new FindUserAdminByIdRequest();
                findUserAdmin.userId = userAdmin._id.toString();
                const email = await this.sendEmailVerification(findUserAdmin, host);
                delete userAdmin.password;
                delete userAdmin.oldPasswords;
                delete userAdmin.accessToken;
                delete userAdmin.emailVerificationId;
                return ResponseSuccess(200, userAdmin);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async find(findUserAdmin: FindUserAdminByIdRequest): Promise<IModelResponse> {
        try {
            const userAdmin = await this.store.get(findUserAdmin.userId);
            if (!userAdmin) {
                return ResponseFailure(400, `UserAdmin with this id ${findUserAdmin.userId} not found`);
            }
            else {
                delete userAdmin.password;
                delete userAdmin.oldPasswords;
                delete userAdmin.accessToken;
                delete userAdmin.emailVerificationId;
                return ResponseSuccess(200, userAdmin);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async findByEmail(findUserAdmin: FindUserAdminByEmailRequest): Promise<IModelResponse> {
        try {
            const userAdmin = await this.store.getByEmail(findUserAdmin.email);
            if (!userAdmin) {
                return ResponseFailure(400, `UserAdmin with this email ${findUserAdmin.email} not found`);
            }
            else {
                delete userAdmin.password;
                delete userAdmin.oldPasswords;
                delete userAdmin.accessToken;
                delete userAdmin.emailVerificationId;
                return ResponseSuccess(200, userAdmin);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async update(editUserAdmin: EditUserAdminRequest): Promise<IModelResponse> {
        try {

            let userAdmin = await this.store.get(editUserAdmin.userId);
            if (!userAdmin) {
                return ResponseFailure(400, `UserAdmin with this id ${editUserAdmin.userId} not found`);
            }
            else {
                userAdmin = await this.store.edit(editUserAdmin.userId, editUserAdmin.firstname, editUserAdmin.lastname);
                delete userAdmin.password;
                delete userAdmin.oldPasswords;
                delete userAdmin.accessToken;
                delete userAdmin.emailVerificationId;
                return ResponseSuccess(200, userAdmin);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async remove(removeUserAdmin: FindUserAdminByIdRequest): Promise<IModelResponse> {
        try {
            let userAdmin = await this.store.get(removeUserAdmin.userId);
            if (!userAdmin) {
                return ResponseFailure(400, `UserAdmin with this id ${removeUserAdmin.userId} not found`);
            }
            else {
                await this.store.delete(removeUserAdmin.userId)
                return ResponseSuccess(200, true);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }

    }


    async editPassword(editUserAdmin: EditUserAdminPasswordRequest): Promise<IModelResponse> {
        try {
            let userAdmin = await this.store.get(editUserAdmin.userId);
            if (!userAdmin) {
                return ResponseFailure(400, `UserAdmin with this id ${editUserAdmin.userId} not found`);
            }
            else {
                const passwordExist = await this.store.checkPasswordExist(editUserAdmin.userId, editUserAdmin.password);
                if (passwordExist) {
                    return ResponseFailure(400, `UserAdmin with this id ${editUserAdmin.userId} has already this password`);
                }
                else {
                    userAdmin = await this.store.editPassword(editUserAdmin.userId, editUserAdmin.password);
                    delete userAdmin.password;
                    delete userAdmin.oldPasswords;
                    delete userAdmin.accessToken;
                    delete userAdmin.emailVerificationId;
                    return ResponseSuccess(200, userAdmin);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async editEmail(editUserAdmin: EditUserAdminEmailRequest, host: string): Promise<IModelResponse> {
        try {
            let userAdmin = await this.store.get(editUserAdmin.userId);
            if (!userAdmin) {
                return ResponseFailure(400, `UserAdmin with this id ${editUserAdmin.userId} not found`);
            }
            else {
                userAdmin = await this.store.editEmail(editUserAdmin.userId, editUserAdmin.email);
                const findUserAdmin: FindUserAdminByIdRequest = new FindUserAdminByIdRequest();
                findUserAdmin.userId = editUserAdmin.userId;
                const email = await this.sendEmailVerification(findUserAdmin, host);

                delete userAdmin.password;
                delete userAdmin.oldPasswords;
                delete userAdmin.accessToken;
                delete userAdmin.emailVerificationId;
                return ResponseSuccess(200, userAdmin);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async sendEmailVerification(findUserAdmin: FindUserAdminByIdRequest, host: string): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve, reject) => {
            try {
                let userAdmin = await this.store.get(findUserAdmin.userId);
                if (!userAdmin) {
                    resolve(ResponseFailure(400, `UserAdmin with this id ${findUserAdmin.userId} not found`));
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
                            reject(ResponseFailure(500, error));
                        } else {
                            resolve(ResponseSuccess(202, true));
                        }
                    });
                }
            }
            catch (error) {
                reject(ResponseFailure(500, error));
            }
        });
    }

    async verifyEmail(findUserAdmin: FindUserAdminByEmailVerificationIdRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.getByEmailVerificationId(findUserAdmin.emailVerificationId);
            if (!user) {
                return ResponseFailure(400, `User with this emailVerificationId ${findUserAdmin.emailVerificationId} not found`);
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

}