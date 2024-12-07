import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from '../roles/entities/role.entity';
import { hashPassword } from '../utils/functions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly rolesRepository: Repository<Role>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationsRepository: Repository<Association>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    if (id === 'me') {
      console.error('Invalid id "me" passed to findOne');
      throw new NotFoundException('Invalid user ID');
    }
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles.permissions', 'associations'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);

    const role = await this.rolesRepository.findOne({
      where: { id: createUserDto.roleId },
    });
    console.log(role);
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createUserDto.roleId} not found`,
      );
    }

    const association = await this.associationsRepository.findOne({
      where: {
        id: createUserDto.associationId,
      },
    });
    if (!association) {
      throw new NotFoundException(
        `Association with ID ${createUserDto.associationId} not found`,
      );
    }
    const newUser = new User();
    newUser.password = hashedPassword;
    newUser.roles = [role];
    newUser.associations = [association];
    newUser.email = createUserDto.email;
    newUser.first_name = createUserDto.firstName;
    newUser.last_name = createUserDto.lastName;
    newUser.phone = createUserDto.phone;
    newUser.localisation = createUserDto.localisation;
    //newUser.image = createUserDto.image;
    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'associations'],
    });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { id: updateUserDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateUserDto.roleId} not found`,
        );
      }
    }

    Object.assign(existingUser, updateUserDto);
    return await this.usersRepository.save(existingUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'associations'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email ${registerDto.email} already exists`,
      );
    }

    const hashedPassword = await hashPassword(registerDto.password);

    const userRole = await this.rolesRepository.findOne({
      where: { name: 'User' },
    });
    if (!userRole) {
      throw new NotFoundException(`Role 'User' not found`);
    }

    const newUser = new User();
    newUser.password = hashedPassword;
    newUser.email = registerDto.email;
    newUser.first_name = registerDto.firstName;
    newUser.last_name = registerDto.lastName;
    newUser.phone = registerDto.phone;
    newUser.localisation = registerDto.localisation;
    //  newUser.image = registerDto.image;
    newUser.roles = [userRole];

    return this.usersRepository.save(newUser);
  }
}
