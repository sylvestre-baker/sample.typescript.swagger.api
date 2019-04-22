import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
    description: "Godchild Model from DB",
    name: "ModelGodchild"
})

export class ModelGodchild{
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    userId: string;
    @ApiModelProperty()
    userEmail: string;
    @ApiModelProperty()
    godfatherCode: string; 
    @ApiModelProperty()
    code: string; 
}