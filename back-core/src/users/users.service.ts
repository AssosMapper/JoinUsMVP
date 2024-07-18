import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { Association } from '../associations/entities/association.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private usersRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY') private rolesRepository: Repository<Role>,
    @Inject('ASSOCIATION_REPOSITORY') private associationsRepository: Repository<Association>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const role = await this.rolesRepository.findOne({ where: { id: createUserDto.roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${createUserDto.roleId} not found`);
    }

    const association = await this.associationsRepository.findOne({
      where: {
        id: createUserDto.idAssociation,
      }
    });
    if (!association) {
      throw new NotFoundException(`Association with ID ${createUserDto.idAssociation} not found`);
    }
    const newUser = new User();
    newUser.password = hashedPassword;
    newUser.roles = [role];
    newUser.association = association;
    newUser.email = createUserDto.email;
    newUser.first_name = createUserDto.first_name;
    newUser.last_name = createUserDto.last_name;
    newUser.phone = createUserDto.phone;
    newUser.localisation = createUserDto.localisation;
    newUser.image = createUserDto.image;
    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
      relations: ['role','association'],
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.roleId) {
      const role = await this.rolesRepository.findOne({ where: { id: updateUserDto.roleId } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.roleId} not found`);
      }
    }

    Object.assign(existingUser, updateUserDto);
    await this.usersRepository.save(existingUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { email },
      relations: ['role', 'association'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
