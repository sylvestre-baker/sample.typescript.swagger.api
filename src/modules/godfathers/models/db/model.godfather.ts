import { ApiModel, ApiModelProperty } from "swagger-express-ts";


@ApiModel({
    description: "Godfather Model from DB",
    name: "ModelGodfather"
})

export class ModelGodfather{
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    userId: string;
    @ApiModelProperty()
    userEmail: string;   
    @ApiModelProperty()
    code: string; 
}


