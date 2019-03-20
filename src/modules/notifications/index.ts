export * from './services';

import { Application } from 'express';
import { Container } from 'inversify';

import { TYPES } from '../../modules/common';
import { ServiceNotification } from './services/index';


export function useServiceNotification(app: Application, container: Container) {
    container.bind<ServiceNotification>(TYPES.ServiceNotification).to(ServiceNotification);
}