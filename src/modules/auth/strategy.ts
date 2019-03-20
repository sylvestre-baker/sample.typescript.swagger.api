import { Container } from 'inversify';
import { Strategy } from 'passport-http-bearer';
import * as jwt from 'jsonwebtoken';
import configAuth from './models/config.auth';

export function strategyfactory(container: Container) {
    return new Strategy(
        async function (token, cb) {
            try {
                jwt.verify(token, configAuth.secret, (err, decoded) => {
                    if (err) {
                        cb(null, false)
                    } else {
                        // if everything is good, save to request for use in other routes
                        const userId = decoded.userId;
                        if (userId)
                            cb(null, userId)
                        else
                            cb(null, false)
                    }
                });
            } catch (e) {
                cb(null, false);
            }
        });
}



export function strategyfactoryAdmin(container: Container) {
    return new Strategy(
        async function (token, cb) {
            try {
                jwt.verify(token, configAuth.secret, (err, decoded) => {
                    if (err) {
                        cb(null, false)
                    } else {
                        // if everything is good, save to request for use in other routes
                        const userId = decoded.userId;
                        const admin = decoded.admin
                        if (userId && admin)
                            cb(null, userId)
                        else
                            cb(null, false)
                    }
                });
            } catch (e) {
                cb(null, false);
            }
        });
}