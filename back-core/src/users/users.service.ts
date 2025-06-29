import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import {
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
} from '@shared/dto/user.dto';
import { RegisterDto } from '@shared/dto/auth.dto';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { LocalisationService } from '../localisation/localisation.service';
import { MediaService } from '../media/media.service';
import { Role } from '../roles/entities/role.entity';
import { hashPassword } from '../utils/functions';
import { User } from './entities/user.entity';
import { UploadMediaDto } from '@shared/dto/media.dto';
import { PROFILE_PICTURE_PATH } from '../media/enums/media.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly rolesRepository: Repository<Role>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationsRepository: Repository<Association>,
    private readonly localisationService: LocalisationService,
    private readonly mediaService: MediaService,
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

  async getProfile(id: string): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles.permissions', 'localisation', 'image'],
    });
    return user;
  }

  async checkEmailExists(
    email: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const whereCondition: any = { email };

    if (excludeUserId) whereCondition.id = Not(excludeUserId);

    const existingUser = await this.usersRepository.findOne({
      where: whereCondition,
    });

    return !!existingUser;
  }

  async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const emailExists = await this.checkEmailExists(createUserDto.email);
    if (emailExists) {
      throw new ConflictException(
        `Un utilisateur avec l'email ${createUserDto.email} existe déjà`,
      );
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const newUser = new User();
    newUser.password = hashedPassword;
    newUser.email = createUserDto.email;
    newUser.first_name = createUserDto.first_name;
    newUser.last_name = createUserDto.last_name;
    newUser.phone = createUserDto.phone;

    const savedUser = await this.usersRepository.save(newUser);

    const userWithRelations = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['localisation'],
    });

    return plainToInstance(UserProfileDto, userWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'associations', 'image'],
    });
    if (!existingUser)
      throw new NotFoundException(`User with ID ${id} not found`);

    if (updateUserDto.email) {
      const emailExists = await this.checkEmailExists(updateUserDto.email, id);
      if (emailExists) {
        throw new ConflictException(
          `Un utilisateur avec l'email ${updateUserDto.email} existe déjà`,
        );
      }
    }

    if (updateUserDto.password)
      updateUserDto.password = await hashPassword(updateUserDto.password);

    if (updateUserDto.imageId) {
      const media = await this.mediaService.findOne(updateUserDto.imageId);
      if (!media) {
        throw new NotFoundException(
          `Une erreur est survenue lors de l'upload de l'image`,
        );
      }
      delete updateUserDto.imageId;
      existingUser.image = media;
    }
    Object.assign(existingUser, updateUserDto);
    const savedUser = await this.usersRepository.save(existingUser);
    return savedUser;
  }

  async updateProfile(
    id: string,
    updateUserDto?: UpdateUserDto,
    saveLocalisationDto?: SaveLocalisationDto,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'associations', 'localisation'],
    });

    if (!existingUser)
      throw new NotFoundException(`User with ID ${id} not found`);

    if (updateUserDto) await this.update(id, updateUserDto);

    if (saveLocalisationDto) {
      const savedLocalisation =
        await this.localisationService.save(saveLocalisationDto);

      if (!existingUser.localisation) {
        existingUser.localisation = savedLocalisation;
        await this.usersRepository.save(existingUser);
      }
    }
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'associations', 'localisation'],
    });
  }

  async changeProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['image'],
    });

    if (!user) throw new NotFoundException(`Une erreur est survenue`);

    const newMedia = await this.mediaService.save(
      file,
      plainToInstance(UploadMediaDto, {
        id: user?.image?.id,
        filepath: PROFILE_PICTURE_PATH,
      }),
    );
    user.image = newMedia;
    await this.usersRepository.save(user);

    return newMedia;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'associations'],
    });
  }

  async removeProfilePicture(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['image'],
    });

    if (!user) throw new NotFoundException(`Une erreur est survenue`);
    user.image = null;
    await this.usersRepository.save(user);
    if (user.image) await this.mediaService.remove(user.image);
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
    newUser.roles = [userRole];

    return this.usersRepository.save(newUser);
  }
}
