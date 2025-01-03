import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async createMany(data: Array<Permission>) {
<<<<<<< HEAD
=======
    //create many permissions
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    return this.permissionRepository.save(data);
  }
}