import { Module } from '@nestjs/common';
import { AssociationApplicationsController } from './association-applications.controller';
import { AssociationApplicationsService } from './association-applications.service';

import {UsersModule} from "../users/users.module";
import {AssociationsModule} from "../associations/associations.module";

@Module({
    imports: [UsersModule,AssociationsModule],
    controllers: [AssociationApplicationsController],
    providers: [AssociationApplicationsService],
    exports: [AssociationApplicationsService]
})
export class AssociationApplicationsModule {}