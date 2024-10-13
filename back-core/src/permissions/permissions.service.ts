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
    return this.permissionRepository.save(data);
  }
}