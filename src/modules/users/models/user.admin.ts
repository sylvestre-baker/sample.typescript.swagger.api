import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser, ModelUserAdmin } from './db/index';
import { IModelResponse } from '../../interfaces/index';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';


@ApiModel({
    description: "User Admin Response",
    name: "UserAdminResponse"
})
export class UserAdminResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "ModelUserAdmin",
        required:true
    })
    data: ModelUserAdmin;
}

@ApiModel({
    description: "Users Admin Response",
    name: "UsersAdminResponse"
})
export class UsersAdminResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "ModelUserAdmin",
        type:SwaggerDefinitionConstant.ARRAY,
        required:true
    })
    data: ModelUserAdmin[];
}


@ApiModel({
    description: "Create User Admin Request",
    name: "CreateUserAdminRequest"
})
export class CreateUserAdminRequest {
    @ApiModelProperty({
        description: "Firstname",
        required: true
    })
    @Constraint(joi.string().required())
    firstname: string;

    @ApiModelProperty({
        description: "Lastname",
        required: true
    })
    @Constraint(joi.string().required())
    lastname: string;

    @ApiModelProperty({
        description: "Email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "Password",
        required: true
    })
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}


@ApiModel({
    description: "Find User Admin By Email Request",
    name: "FindUserAdminByEmailRequest"
})
export class FindUserAdminByEmailRequest {
    @ApiModelProperty({
        description: "Email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "Find User Admin By Id Request",
    name: "FindUserAdminByIdRequest"
})
export class FindUserAdminByIdRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;
}

@ApiModel({
    description: "Edit User Admin Request",
    name: "EditUserAdminRequest"
})
export class EditUserAdminRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "Firstname",
        required: true
    })
    @Constraint(joi.string().required())
    firstname: string;

    @ApiModelProperty({
        description: "Lastname",
        required: true
    })
    @Constraint(joi.string().required())
    lastname: string;
}

@ApiModel({
    description: "Edit User Admin Password Request",
    name: "EditUserAdminPasswordRequest"
})
export class EditUserAdminPasswordRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "Password",
        required: true
    })
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}

@ApiModel({
    description: "Edit User Admin Email Request",
    name: "EditUserAdminEmailRequest"
})
export class EditUserAdminEmailRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "Email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "Find User Admin By EmailVerificationId Request",
    name: "FindUserAdminByEmailVerificationIdRequest"
})
export class FindUserAdminByEmailVerificationIdRequest {
    @ApiModelProperty({
        description: "emailVerificationId",
        required: true
    })
    @Constraint(joi.string().required())
    emailVerificationId: string;
}

