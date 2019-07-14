import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser, ModelUserAdmin } from '../../users/models/index';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IModelResponse } from '../../interfaces/api/index';


@ApiModel({
    description: "UserEmailPasswordAuthRequest",
    name: "UserEmailPasswordAuthRequest"
})
export class UserEmailPasswordAuthRequest {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "password",
        required: true
    })
    @Constraint(joi.string().required())
    password: string;
}

@ApiModel({
    description: "AccesTokenAuthResponse",
    name: "AccesTokenAuthResponse"
})
export class AccesTokenAuthResponse {
    @ApiModelProperty({
        description: "access_token",
    })
    access_token: string;

    @ApiModelProperty({
        description: "user",
        model:"ModelUser"
    })
    user: ModelUser;
}

@ApiModel({
    description: "AccesTokenAuthAdminResponse",
    name: "AccesTokenAuthAdminResponse"
})
export class AccesTokenAuthAdminResponse {
    @ApiModelProperty({
        description: "access_token",
    })
    access_token: string;

    @ApiModelProperty({
        description: "user",
        model:"ModelUserAdmin"
    })
    user: ModelUserAdmin;
}

@ApiModel({
    description: "UserEmailAuthRequest",
    name: "UserEmailAuthRequest"
})
export class UserEmailAuthRequest {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "SendEmailVerificationResponse",
    name: "SendEmailVerificationResponse"
})
export class SendEmailVerificationResponse {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "emailVerificationSent",
        required: true
    })
    @Constraint(joi.string().required())
    emailVerificationSent: boolean;
}

@ApiModel({
    description: "SendEmailPasswordLostResponse",
    name: "SendEmailPasswordLostResponse"
})
export class SendEmailPasswordLostResponse {
    @ApiModelProperty({
        description: "email"
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "emailPasswordLostSent"
    })
    @Constraint(joi.string().required())
    emailPasswordLostSent: boolean;
}



@ApiModel({
    description: "PasswordLostResponse",
    name: "PasswordLostResponse"
})
export class PasswordLostResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "SendEmailPasswordLostResponse",
        required:true
    })
    data: SendEmailPasswordLostResponse;
}

@ApiModel({
    description: "PasswordLostErrorResponse",
    name: "PasswordLost"
})
export class PasswordLostErrorResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    @ApiModelProperty({
        description: "message"
    })
    message: string;
    @ApiModelProperty({
        description: "error",
        required:true
    })
    error: string;
    
    data: any;
}

@ApiModel({
    description: "EmailVerificationResponse",
    name: "EmailVerificationResponse"
})
export class EmailVerificationResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "SendEmailVerificationResponse",
        required:true
    })
    data: SendEmailVerificationResponse;
}

@ApiModel({
    description: "EmailVerificationErrorResponse",
    name: "EmailVerificationErrorResponse"
})
export class EmailVerificationErrorResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    @ApiModelProperty({
        description: "message"
    })
    message: string;
    @ApiModelProperty({
        description: "error",
        required:true
    })
    error: string;
    
    data: any;
}

@ApiModel({
    description: "Auth Response",
    name: "AuthResponse"
})
export class AuthResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "AccesTokenAuthResponse",
        required:true
    })
    data: AccesTokenAuthResponse;
}

@ApiModel({
    description: "Auth Admin Response",
    name: "AuthAdminResponse"
})
export class AuthAdminResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "AccesTokenAuthAdminResponse",
        required:true
    })
    data: AccesTokenAuthAdminResponse;
}


@ApiModel({
    description: "Auth Error Response",
    name: "AuthErrorResponse"
})
export class AuthErrorResponse implements IModelResponse{
    @ApiModelProperty({
        description: "code",
        required:true
    })
    code : number;
    @ApiModelProperty({
        description: "message"
    })
    message: string;
    @ApiModelProperty({
        description: "error",
        required:true
    })
    error: string;
    
    data: any;
}
