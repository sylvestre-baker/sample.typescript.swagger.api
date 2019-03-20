export * from './models';
export * from './services';

import { Application } from 'express';
import { Container } from 'inversify';

import { TYPES } from '../../modules/common';
import { StoreUser, ServiceUser, ServiceUserAdmin, StoreUserAdmin } from './services/index';


export function useServiceUser(app: Application, container: Container) {
    container.bind<StoreUser>(TYPES.StoreUser).to(StoreUser);
    container.bind<ServiceUser>(TYPES.ServiceUser).to(ServiceUser);
    container.bind<StoreUserAdmin>(TYPES.StoreUserAdmin).to(StoreUserAdmin);
    container.bind<ServiceUserAdmin>(TYPES.ServiceUserAdmin).to(ServiceUserAdmin);
}