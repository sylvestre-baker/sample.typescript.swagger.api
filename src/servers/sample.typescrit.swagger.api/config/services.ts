import { interfaces, controller, TYPE } from 'inversify-express-utils';
import { Container } from 'inversify';
import {
    ControllerHome,
    ControllerUser,
    ControllerAuthentification,
    ControllerGodfather
} from '../controllers';
import { PassportStatic } from 'passport';
import { TAGS } from '../../../modules/common';


export default function configureServices(container: Container, passport: PassportStatic): Container {
    // controllers
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerHome).whenTargetNamed(TAGS.ControllerHome);
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerUser).whenTargetNamed(TAGS.ControllerUser);
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerAuthentification).whenTargetNamed(TAGS.ControllerAuthentification);
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerGodfather).whenTargetNamed(TAGS.ControllerGodfather);

    return container;
}
