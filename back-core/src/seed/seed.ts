import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { AssociationApplicationSeedService } from './seeders/association-application-seed.service';
import { AssociationSeedService } from './seeders/association-seed.service';
import { EventSeedService } from './seeders/event-seed.service';
import { NotificationSeedService } from './seeders/notification-seed.service';
import { PermissionSeedService } from './seeders/permission-seed.service';
import { RoleSeedService } from './seeders/role-seed.service';
import { TypeAssociationsSeedService } from './seeders/type-association-seed.service';
import { TypeEventsSeedService } from './seeders/type-event-seed.service';
import { UserSeedService } from './seeders/user-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  await app.get(PermissionSeedService).seed();
  await app.get(RoleSeedService).seed();
  await app.get(TypeAssociationsSeedService).seed();
  await app.get(TypeEventsSeedService).seed();
  await app.get(AssociationSeedService).seed();
  await app.get(UserSeedService).seed();
  await app.get(AssociationApplicationSeedService).seed();
  await app.get(EventSeedService).seed();
  await app.get(NotificationSeedService).seed();

  await app.close();
  process.exit(0);
}

bootstrap();
