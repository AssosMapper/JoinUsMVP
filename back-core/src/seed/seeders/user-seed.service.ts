import { Inject, Injectable } from '@nestjs/common';
import * as https from 'https';
import { Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { MediaService } from '../../media/media.service';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { OnDev } from '../../utils/decorators/on-dev.decorator';
import { hashPassword } from '../../utils/functions';
import { PROFILE_PICTURE_PATH } from '../../media/enums/media.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
    private readonly mediaService: MediaService,
  ) {}

  @OnDev()
  async seed() {
    await this.drop();
    const users = [];

    // Récupérer toutes les associations
    const associations = await this.associationRepository.find();

    // Create SuperAdmin user
    const superAdminRole = await this.roleRepository.findOne({
      where: { name: 'SuperAdmin' },
    });
    if (!superAdminRole) {
      console.log('Role SuperAdmin not found');
      return;
    }
    let user = new User();
    user.first_name = 'Admin';
    user.last_name = 'Admin';
    user.email = 'admin@test.com';
    user.password = await hashPassword('Password123!');
    user.roles = [superAdminRole];
    user.isActive = true;
    user.associations = associations; // L'admin est membre de toutes les associations
    users.push(user);

    // Create AssociationManager user
    const associationManagerRole = await this.roleRepository.findOne({
      where: { name: 'AssociationManager' },
    });
    if (!associationManagerRole) {
      console.log('Role AssociationManager not found');
      return;
    }

    const imageFile = await this.downloadImageFromPicsum(200);

    const uploadedImage = await this.mediaService.create(imageFile, {
      filepath: PROFILE_PICTURE_PATH,
    });
    console.log('Image uploaded successfully:', uploadedImage.filename);

    user = new User();
    user.first_name = 'Manager';
    user.last_name = 'Association';
    user.email = 'associationmanager@test.com';
    user.password = await hashPassword('Password123!');
    user.roles = [associationManagerRole];
    user.isActive = true;
    user.image = uploadedImage;
    users.push(user);

    // Create EventsManager user
    const eventsManagerRole = await this.roleRepository.findOne({
      where: { name: 'EventsManager' },
    });
    if (!eventsManagerRole) {
      console.log('Role EventsManager not found');
      return;
    }
    user = new User();
    user.first_name = 'Events';
    user.last_name = 'Manager';
    user.email = 'eventsmanager@test.com';
    user.password = await hashPassword('Password123!');
    user.roles = [eventsManagerRole];
    user.isActive = true;
    users.push(user);

    console.log('Seeding users...');
    await this.userRepository.save(users);
    console.log('Seeded users...');
  }

  private async drop() {
    console.log('Dropping users...');
    await this.userRepository.delete({});
    console.log('Dropped users...');
  }

  /**
   * Télécharge une image depuis Lorem Picsum et la convertit en objet Multer.File
   */
  private async downloadImageFromPicsum(
    size: number = 200,
  ): Promise<Express.Multer.File> {
    const url = `https://picsum.photos/${size}`;

    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          const chunks: Buffer[] = [];

          response.on('data', (chunk) => {
            chunks.push(chunk);
          });

          response.on('end', () => {
            const buffer = Buffer.concat(chunks);

            // Créer un objet Multer.File à partir du buffer
            const multerFile: Express.Multer.File = {
              fieldname: 'file',
              originalname: `picsum-${size}x${size}.jpg`,
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: buffer,
              size: buffer.length,
              destination: '',
              filename: '',
              path: '',
              stream: null,
            };

            resolve(multerFile);
          });

          response.on('error', (error) => {
            reject(error);
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
