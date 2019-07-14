
import { injectable, inject } from 'inversify';
import { TYPES, ResponseFailure, ResponseSuccess } from '../../../modules/common';

import {
    UserEmailAuthRequest,
    AccesTokenAuthResponse,
    UserEmailPasswordAuthRequest,
    SendEmailVerificationResponse,
    SendEmailPasswordLostResponse,
    AccesTokenAuthAdminResponse
} from '../models';
import { StoreUser, ServiceUser, StoreUserAdmin, ServiceUserAdmin, CreateUserAdminRequest } from '../../users';
import { CreateUserRequest } from '../../users/models/user';
import configAuth from '../models/config.auth';
import * as  jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';
import { IModelResponse } from '../../interfaces/api/index';
@injectable()
export class ServiceAuthentification {
    constructor(
        @inject(TYPES.StoreUser) private storeUser: StoreUser,
        @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,
        @inject(TYPES.StoreUserAdmin) private storeUserAdmin: StoreUserAdmin,
        @inject(TYPES.ServiceUserAdmin) private serviceUserAdmin: ServiceUserAdmin,
    ) {

    }

    async signup(newUser: CreateUserRequest, host: string): Promise<IModelResponse> {
        try {
            newUser.email = newUser.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthResponse();
            let user = await this.storeUser.getByEmail(newUser.email);
            if (user) {
                return (ResponseFailure(400, `User with this email ${newUser.email} already exists`))
            }

            else {
                const userResp = await this.serviceUser.create(newUser, host);
                if (!userResp.data) {
                    return userResp;
                }
                else {
                    user = userResp.data;
                    const payload = {
                        admin: user.isAdmin,
                        claims: user.claims,
                        userId: user._id,
                        email: user.email
                    };

                    var token = jwt.sign(payload, configAuth.secret, {
                        expiresIn: 60 * 60 * 24 * 30 // expires in 30 days
                    });
                    user = await this.storeUser.setAccessToken(user._id.toString(), token);

                    accesTokenAuthResponse.user = user;
                    accesTokenAuthResponse.access_token = token;
                    delete accesTokenAuthResponse.user.password;
                    delete accesTokenAuthResponse.user.oldPasswords;
                    delete accesTokenAuthResponse.user.accessToken;
                    return ResponseSuccess(200, accesTokenAuthResponse);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async signupAdmin(newUser: CreateUserAdminRequest, host: string): Promise<IModelResponse> {
        try {
            newUser.email = newUser.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthAdminResponse();
            let user = await this.storeUserAdmin.getByEmail(newUser.email);
            if (user) {
                return (ResponseFailure(400, `User with this email ${newUser.email} already exists`))
            }

            else {
                const userResp = await this.serviceUserAdmin.create(newUser, host);
                if (!userResp.data) {
                    return userResp;
                }
                else {
                    user = userResp.data;
                    const payload = {
                        admin: user.isAdmin,
                        claims: user.claims,
                        userId: user._id,
                        email: user.email
                    };

                    var token = jwt.sign(payload, configAuth.secret, {
                        expiresIn: 60 * 60 * 24 * 30 // expires in 30 days
                    });
                    user = await this.storeUserAdmin.setAccessToken(user._id.toString(), token);

                    accesTokenAuthResponse.user = user;
                    accesTokenAuthResponse.access_token = token;
                    delete accesTokenAuthResponse.user.password;
                    delete accesTokenAuthResponse.user.oldPasswords;
                    delete accesTokenAuthResponse.user.accessToken;
                    return ResponseSuccess(200, accesTokenAuthResponse);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async signin(userSignin: UserEmailPasswordAuthRequest): Promise<IModelResponse> {
        try {
            userSignin.email = userSignin.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthResponse();
            let user = await this.storeUser.getByEmail(userSignin.email);
            if (!user) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} does not exist`))
            }
            else if (await bcrypt.compare(userSignin.password, user.password) == false) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} bad password`))

            }
            else {
                const payload = {
                    admin: user.isAdmin,
                    claims: user.claims,
                    userId: user._id,
                    email: user.email
                };

                var token = jwt.sign(payload, configAuth.secret, {
                    expiresIn: 60 * 60 * 24 * 30 // expires in 30 days
                });
                user = await this.storeUser.setAccessToken(user._id.toString(), token);
                if (!user.emailVerificationId)
                    user.emailVerificationId = '';
                accesTokenAuthResponse.user = user;
                accesTokenAuthResponse.access_token = token;
                delete accesTokenAuthResponse.user.password;
                delete accesTokenAuthResponse.user.oldPasswords;
                delete accesTokenAuthResponse.user.accessToken;
                return ResponseSuccess(200, accesTokenAuthResponse);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async signinAdmin(userSignin: UserEmailPasswordAuthRequest): Promise<IModelResponse> {
        try {
            userSignin.email = userSignin.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthAdminResponse();
            let user = await this.storeUserAdmin.getByEmail(userSignin.email);
            if (!user) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} does not exist`))
            }
            else if (await bcrypt.compare(userSignin.password, user.password) == false) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} bad password`))

            }
            else {
                const payload = {
                    admin: user.isAdmin,
                    claims: user.claims,
                    userId: user._id,
                    email: user.email
                };

                var token = jwt.sign(payload, configAuth.secret, {
                    expiresIn: 60 * 60 * 24 * 30 // expires in 30 days
                });
                user = await this.storeUserAdmin.setAccessToken(user._id.toString(), token);
                if (!user.emailVerificationId)
                    user.emailVerificationId = '';
                accesTokenAuthResponse.user = user;
                accesTokenAuthResponse.access_token = token;
                delete accesTokenAuthResponse.user.password;
                delete accesTokenAuthResponse.user.oldPasswords;
                delete accesTokenAuthResponse.user.accessToken;
                return ResponseSuccess(200, accesTokenAuthResponse);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }
}