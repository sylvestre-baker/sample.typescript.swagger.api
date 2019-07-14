import { IModelResponse } from '../../interfaces';

const dictCodeHttpResponse: { [id: number]: string } = {
    //2xx - Success
    //It means the action was successfully received, understood, and accepted.
    200: 'OK',                      //The request is OK.
    201: 'Created',                 //The request is complete, and a new resource is created.
    202: 'Accepted',                //The request is accepted for processing, but the processing is not complete.
    204: 'No Content',              //A status code and a header are given in the response, but there is no entity-body in the reply.

    //4xx - Client Error
    //It means the request contains incorrect syntax or cannot be fulfilled.
    400: 'Bad Request',             //The server did not understand the request.
    401: 'Unauthorized',            //The requested page needs a username and a password.
    403: 'Forbidden',               //Access is forbidden to the requested page.
    404: 'Not Found',               //The server can not find the requested page.
    405: 'Method Not Allowed',      //The method specified in the request is not allowed.
    408: 'Request Time-out',        //The request took longer than the server was prepared to wait.

    //5xx - Server Error
    //It means the server failed to fulfill an apparently valid request.
    500: 'Internal Server Error',   //The request was not completed. The server met an unexpected condition.
    501: 'Not Implemented',         //The request was not completed. The server did not support the functionality required.
    503: 'Service Unavailable',     //The request was not completed. The server is temporarily overloading or down.
    504: 'Gateway Time-out',        //The gateway has timed out.
    507: 'Insufficient storage',
    509: 'Bandwidth Limit Exceeded',

    520: 'Unknown Error',

}
export function ResponseSuccess(code: number, data: any): IModelResponse {
    const response = new IModelResponse();
    response.code = code;
    response.data = data;
    return response;
}

export function ResponseError(error: any): IModelResponse {
    const response = new IModelResponse();
    if (typeof (error.code) != typeof (Number)) {
        response.code = 500;
    } else {
        response.code = error.code;
    }

    response.error = dictCodeHttpResponse[error.code];
    response.message = error.message;
    return response;
}

export function ResponseFailure(code: number, message: string) {
    const response = new IModelResponse();
    response.code = code;
    response.error = dictCodeHttpResponse[code];
    response.message = message;
    return response;
}