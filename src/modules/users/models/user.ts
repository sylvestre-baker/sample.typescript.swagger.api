import * as joi from 'joi';
import { Constraint } from '../../../modules/common';
import { ModelUser } from './db/index';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';


export class CreateUserRequest {
    @Constraint(joi.string().allow('').required())
    firstname: string;
    @Constraint(joi.string().allow('').required())
    lastname: string;
    @Constraint(joi.string().email().required())
    email: string;
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
    @Constraint(joi.string().allow('').required())
    photoUrl: string;
    @Constraint(joi.string().allow('').required())
    facebookId: string;
    @Constraint(joi.string().allow('').required())
    facebookAccessToken: string;
}

@ApiModel( {
    description : "User Response description" ,
    name : "UserResponse"
} )
export class UserResponse {
    @ApiModelProperty( {
        description : "Success message" 
    } )
    success: boolean = false;
    @ApiModelProperty( {
        description : "Response message"
    } )
    message: string = 'Something Wrong';
    @ApiModelProperty( {
        description : "Response code" 
    } )
    code: number = -1000;
    @ApiModelProperty( {
        description : "Response User"
    } )
    user: ModelUser = null;
}

export class FindUserByEmailRequest {
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel( {
    description : "Find user by Id description" ,
    name : "FindUserByIdRequest"
} )
export class FindUserByIdRequest {
    @ApiModelProperty( {
        description : "UserId request" ,
        required : true
    } )
    @Constraint(joi.string().required())
    userId: string;
}

export class EditUserPhotoByIdRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().required())
    contentBase64: string;
}

export class EditUserRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().required())
    firstname: string;
    @Constraint(joi.string().required())
    lastname: string;
    @Constraint(joi.string().allow('').required())
    phoneNumber: string;
    @Constraint(joi.string().allow('').required())
    photoUrl: string;
    @Constraint(joi.string().allow('').required())
    facebookId: string;
    @Constraint(joi.string().allow('').required())
    facebookAccessToken: string;
    @Constraint(joi.string().valid('male', 'female').required())
    gender: string;
    @Constraint(joi.string().allow('').required())
    address: string;
    @Constraint(joi.string().allow('').required())
    country: string;
    @Constraint(joi.string().allow('').required())
    state: string;
    @Constraint(joi.string().allow('').required())
    city: string;
    @Constraint(joi.string().allow('').required())
    mobileToken: string;
}

export class EditUserPasswordRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}

export class EditUserEmailRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().email().required())
    email: string;
}

export class EditUserFacebookInformationsRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().allow('').required())
    facebookId: string;
    @Constraint(joi.string().allow('').required())
    facebookAccessToken: string;
}

export class EditUserMobileTokensRequest {
    @Constraint(joi.string().required())
    userId: string;
    @Constraint(joi.string().allow('').required())
    mobileToken: string;
}


export class FindUserByEmailVerificationIdRequest {
    @Constraint(joi.string().required())
    emailVerificationId: string;
}

