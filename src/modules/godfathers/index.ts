export * from './models';
export * from './services';

import { Application } from 'express';
import { Container } from 'inversify';

import { TYPES } from '../../modules/common';
import { StoreGodchild, StoreGodfather, ServiceGodfather } from './services/index';


export function useServiceGodfather(app: Application, container: Container) {
    container.bind<StoreGodchild>(TYPES.StoreGodchild).to(StoreGodchild);
    container.bind<StoreGodfather>(TYPES.StoreGodfather).to(StoreGodfather);
    container.bind<ServiceGodfather>(TYPES.ServiceGodfather).to(ServiceGodfather);
}