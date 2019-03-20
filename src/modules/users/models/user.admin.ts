import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser } from './db/index';

export class CreateUserAdminRequest {
    @Constraint(joi.string().required())
    firstname: string;
    @Constraint(joi.string().required())
    lastname: string;
    @Constraint(joi.string().required())
    email: string;
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}

export class UserAdminResponse {
    success: boolean = false;
    message: string = 'Something Wrong';
    code: number = -1000;
    user: ModelUser = null;
}

export class UsersAdminResponse {
    success: boolean = false;
    message: string = 'Something Wrong';
    code: number = -1000;
    users: ModelUser[] = null;
}

export class FindUserAdminByEmailRequest {
    @Constraint(joi.string().email().required())
    email: string;
}

export class FindUserAdminByIdRequest {
    @Constraint(joi.string().required())
    userId: string;
}

export class EditUserAdminRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().required())
    firstname: string;
    @Constraint(joi.string().required())
    lastname: string;
    @Constraint(joi.string().valid('male', 'female').allow('').required())
    gender: string;
}

export class EditUserAdminPasswordRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}

export class EditUserAdminEmailRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().required())
    email: string;
}


export class FindUserAdminByEmailVerificationIdRequest {
    @Constraint(joi.string().required())
    emailVerificationId: string;
}

