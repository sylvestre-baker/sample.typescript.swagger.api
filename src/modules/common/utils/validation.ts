import 'reflect-metadata';
import _ = require('lodash');
import joi = require('joi');
import { ValidationResult } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { IModelResponse } from '../../interfaces';

export const Key = 'AnnotationMeta';
export interface ClassConstructor {
    new();
}

export function Constraint(joi: any): PropertyDecorator {

    return function (target: any, propertyKey: string) {
        let meta = _.assign({}, Reflect.getMetadata(Key, target.constructor));
        meta[propertyKey] = joi;

        Reflect.defineMetadata(Key, meta, target.constructor);
    };
}

export function validate(targetClass: ClassConstructor, instance: any): ValidationResult<any> {
    let meta = Reflect.getMetadata(Key, targetClass);
    if (!meta) {
        return {
            error: null,
            value: {}
        };
    }

    let schema = meta.__schema;

    if (!schema) {

        schema = joi.object().keys(meta);
        meta.__schema = schema;
        Reflect.defineMetadata(Key, meta, targetClass);
    }

    return joi.validate<any>(instance, schema);
}

export function validateBody(bodyType: ClassConstructor) {
    return (req: Request, res: Response, next: NextFunction) => {
        Object.setPrototypeOf(req.body, new bodyType());

        let validation = validate(bodyType, req.body);
        if (validation.error) {
            const response = new IModelResponse();
            response.code = 400;
            response.error = "BODY.ERROR";
            response.message = validation.error;
            res.status(400);
            return res.json(response);
        }
        next();
    };
}

export function validateQuery(queryType: ClassConstructor) {
    return (req: Request, res: Response, next: NextFunction) => {
        Object.setPrototypeOf(req.query, new queryType());

        let validation = validate(queryType, req.query);
        if (validation.error) {
            const response = new IModelResponse();
            response.code = 400;
            response.error = "QUERY.ERROR";
            response.message = validation.error;
            res.status(400);
            return res.json(response);
        }
        next();
    };
}

export function validateParams(paramType: ClassConstructor) {
    return (req: Request, res: Response, next: NextFunction) => {
        Object.setPrototypeOf(req.params, new paramType());

        let validation = validate(paramType, req.params);
        if (validation.error) {
            const response = new IModelResponse();
            response.code = 400;
            response.error = "PARAMS.ERROR";
            response.message = validation.error;
            res.status(400);
            return res.json(response);
        }
        next();
    };
}