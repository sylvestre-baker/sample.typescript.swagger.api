export * from './models';
export * from './services';

import * as passport from 'passport';
import { Request, Response, Express, Application } from 'express';
import { Container, inject } from 'inversify';
import { strategyfactory, strategyfactoryAdmin } from './strategy';
import { ServiceAuthentification } from './services';
import { TYPES } from '../../modules/common';
import configAuth from './models/config.auth';

export function useAuth(app: Application, container: Container) {
    app.use(passport.initialize());
    configAuth.secret = app.get('superSecret');
    passport.use(strategyfactory(container));
    passport.use('bearer-admin', strategyfactoryAdmin(container));
    container.bind<ServiceAuthentification>(TYPES.ServiceAuthentification).to(ServiceAuthentification);
}