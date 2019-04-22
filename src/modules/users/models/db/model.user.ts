import { ApiModel, ApiModelProperty } from "swagger-express-ts";


@ApiModel({
    description: "Address Model from DB",
    name: "ModelAddress"
})
export class ModelAddress {
    @ApiModelProperty()
    country: string;
    @ApiModelProperty()
    state: string;
    @ApiModelProperty()
    city: string;
    @ApiModelProperty()
    address: string;
}

@ApiModel({
    description: "User Model from DB",
    name: "ModelUser"
})
export class ModelUser {
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    uuidMobile: string;
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    mobileToken: string;
    @ApiModelProperty()
    firstname: string;
    @ApiModelProperty()
    lastname: string;
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    phoneNumber: string;
    @ApiModelProperty()
    address: ModelAddress = new ModelAddress();
    @ApiModelProperty()
    claims: ModelClaims = ModelClaims.USER;
    @ApiModelProperty()
    photoUrl: string;
    password: string;
    @ApiModelProperty()
    enable: boolean = true;
    @ApiModelProperty()
    emailVerified: boolean = false;
    @ApiModelProperty()
    emailVerificationId: string;
    oldPasswords: string[] = [];
    @ApiModelProperty()
    gender: ModelGender;
    @ApiModelProperty()
    godfatherCode: string;
    @ApiModelProperty()
    facebookId: string;
    @ApiModelProperty()
    facebookAccessToken: string;
    @ApiModelProperty()
    isAdmin: boolean = false;

}



export enum ModelClaims {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export enum ModelGender {
    female = 'female',
    male = 'male'
}
