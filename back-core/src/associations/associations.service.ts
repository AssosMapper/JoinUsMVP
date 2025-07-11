import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateAssociationDto,
  UpdateAssociationDto,
} from '@shared/dto/associations.dto';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import { PublicUserDto } from '@shared/dto/user.dto';
import { RoleEnum } from '@shared/types/roles';
import { In, Repository } from 'typeorm';
import { Media } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { LocalisationService } from '../localisation/localisation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TypeAssociations } from '../type-associations/entities/type-associations.entity';
import { User } from '../users/entities/user.entity';
import { checkRole } from '../utils/functions/check-role';
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
    private mediaService: MediaService,
    private localisationService: LocalisationService,
  ) {}

  findAll(): Promise<Association[]> {
    return this.associationsRepository.find({
      relations: ['users', 'types', 'localisation', 'image'],
    });
  }

  async findOne(id: string): Promise<Association> {
    const association = await this.associationsRepository.findOne({
      where: { id },
      relations: ['users', 'types', 'image', 'localisation'],
    });
    if (!association) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }
    return association;
  }

  async findByName(name: string): Promise<Association> {
    const association = await this.associationsRepository.findOne({
      where: { name },
      relations: ['types', 'localisation'],
    });
    if (!association) {
      throw new NotFoundException(`Association with name ${name} not found`);
    }
    return association;
  }

  async isInAssociation(userId: string): Promise<boolean> {
    const association = await this.associationsRepository.findOne({
      where: { users: { id: userId } },
    });
    return !!association;
  }

  async create(
    userId: string,
    createAssociationDto: CreateAssociationDto,
    saveLocalisationDto?: SaveLocalisationDto,
    file?: Express.Multer.File,
  ): Promise<Association> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const association = await this.save(
      createAssociationDto,
      saveLocalisationDto,
      file,
    );

    // Ajouter l'utilisateur créateur à l'association
    association.users = [user];
    await this.associationsRepository.save(association);

    // Recharger l'association avec toutes les relations
    return association;
  }

  async save(
    associationData: CreateAssociationDto | UpdateAssociationDto,
    saveLocalisationDto?: SaveLocalisationDto,
    file?: Express.Multer.File,
    existingAssociation?: Association,
  ): Promise<Association> {
    if (associationData.name) {
      const nameExists = await this.associationsRepository.findOne({
        where: { name: associationData.name },
      });

      if (
        nameExists &&
        (!existingAssociation || nameExists.id !== existingAssociation.id)
      ) {
        throw new ConflictException({
          message: `Une association avec le nom "${associationData.name}" existe déjà`,
        });
      }
    }

    const association = existingAssociation || new Association();

    if (saveLocalisationDto) {
      const localisation =
        await this.localisationService.save(saveLocalisationDto);
      association.localisation = localisation;
    }

    if (associationData.typeIds) {
      const types = await this.typeAssociationsRepository.findBy({
        id: In(associationData.typeIds),
      });
      association.types = types;
    }

    if (file) {
      const uploadedMedia = await this.mediaService.create(file, {
        filepath: '/uploads/associations',
      });
      association.image = uploadedMedia;
    }

    Object.assign(association, {
      name: associationData.name,
      description: associationData.description,
      isPublic: associationData.isPublic,
      applicationQuestion: associationData.applicationQuestion,
    });

    return this.associationsRepository.save(association);
  }

  async update(
    id: string,
    updateAssociationDto: UpdateAssociationDto,
    saveLocalisationDto?: SaveLocalisationDto,
    file?: Express.Multer.File,
  ): Promise<Association> {
    console.log('Update DTO received:', updateAssociationDto);
    const existingAssociation = await this.findOne(id);
    if (!existingAssociation) {
      throw new NotFoundException(`Association with ID ${id} not found`);
    }

    return await this.save(
      updateAssociationDto,
      saveLocalisationDto,
      file,
      existingAssociation,
    );
  }

  async remove(id: string): Promise<void> {
    await this.associationsRepository.delete(id);
  }

  async findUserAssociations(userId: string): Promise<Association[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    const relations = ['users', 'types', 'localisation', 'image'];
    console.log(
      await this.associationsRepository.find({
        relations,
      }),
    );
    if (checkRole(user, RoleEnum.SUPER_ADMIN))
      return await this.associationsRepository.find({
        relations,
      });

    return await this.associationsRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations,
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
