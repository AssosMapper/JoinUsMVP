import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicUserDto } from '@shared/dto/user.dto';
import { RoleEnum } from '@shared/types/roles';
import { In, Repository } from 'typeorm';
import { Media } from '../media/entities/media.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { TypeAssociations } from '../type-associations/entities/type-associations.entity';
import { User } from '../users/entities/user.entity';
import { checkRole } from '../utils/functions/check-role';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Association } from './entities/association.entity';
@Injectable()
export class AssociationsService {
  constructor(
    @Inject('ASSOCIATION_REPOSITORY')
    private associationsRepository: Repository<Association>,
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
    @Inject('TYPE_ASSOCIATIONS_REPOSITORY')
    private typeAssociationsRepository: Repository<TypeAssociations>,
    private notificationsService: NotificationsService,
    @Inject('MEDIA_REPOSITORY')
    private mediaRepository: Repository<Media>,
  ) {}

  findAll(): Promise<Association[]> {
    return this.associationsRepository.find({ relations: ['users', 'types'] });
  }

  async findOne(id: string): Promise<Association> {
    const association = await this.associationsRepository.findOne({
      where: { id },
      relations: ['users', 'types', 'image'],
    });
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return association;
  }

  async findByName(name: string): Promise<Association> {
    const association = await this.associationsRepository.findOne({
      where: { name },
      relations: ['types'],
    });
    if (!association) {
      throw new NotFoundException(`Association with name ${name} not found`);
    }
    return association;
  }

  async create(
    user: User,
    createAssociationDto: CreateAssociationDto,
  ): Promise<Association> {
    const types = await this.typeAssociationsRepository.findBy({
      id: In(createAssociationDto.typeIds),
    });

    const association = new Association();
    association.name = createAssociationDto.name;
    association.description = createAssociationDto.description;
    if (createAssociationDto.image) {
      const media = await this.mediaRepository.findOne({
        where: { id: createAssociationDto.image },
      });
      if (media) {
        association.image = media;
      }
    }
    association.localisation = createAssociationDto.localisation;
    association.users = [user];
    association.types = types;
    return this.associationsRepository.save(association);
  }

  async update(
    id: string,
    updateAssociationDto: UpdateAssociationDto,
  ): Promise<Association> {
    console.log('Update DTO received:', updateAssociationDto);
    const existingAssociation = await this.findOne(id);
    if (!existingAssociation) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }

    if (Array.isArray(updateAssociationDto.typeIds)) {
      existingAssociation.types = await this.typeAssociationsRepository.findBy({
        id: In(updateAssociationDto.typeIds),
      });
    }

    if (updateAssociationDto.image) {
      const media = await this.mediaRepository.findOne({
        where: { id: updateAssociationDto.image },
      });
      if (media) existingAssociation.image = media;
    }

    console.log('Existing association before update:', existingAssociation);
    Object.assign(existingAssociation, updateAssociationDto);
    console.log('Association after merge:', existingAssociation);

    return await this.associationsRepository.save(existingAssociation);
  }

  async remove(id: string): Promise<void> {
    await this.associationsRepository.delete(id);
  }

  async findUserAssociations(userId: string): Promise<Association[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (checkRole(user, RoleEnum.SUPER_ADMIN)) return await this.findAll();

    // Sinon, retourner uniquement les associations de l'utilisateur
    return await this.associationsRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users', 'types'],
    });
  }

  async getMembers(id: string): Promise<PublicUserDto[]> {
    const association = await this.associationsRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }

    return association.users.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      first_name: user.first_name,
      last_name: user.last_name,
      image: user.image,
    }));
  }

  async removeMember(associationId: string, userId: string): Promise<void> {
    const association = await this.associationsRepository.findOne({
      where: { id: associationId },
      relations: ['users'],
    });

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!association || !user)
      throw new NotFoundException(`Association ou utilisateur non trouvé`);
    if (checkRole(user, RoleEnum.ASSOCIATION_MANAGER))
      throw new UnauthorizedException(
        "Un gérant d'association ne peut pas être viré d'une association",
      );

    // Retirer le membre
    association.users = association.users.filter((user) => user.id !== userId);
    await this.associationsRepository.save(association);

    // Envoyer une notification à l'utilisateur banni
    await this.notificationsService.create({
      userId: userId,
      title: "Exclusion d'association",
      message: `Vous avez été exclu de l'association ${association.name}`,
    });
  }
}
