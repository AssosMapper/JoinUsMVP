import { UploadMediaDto } from '@shared/dto/media.dto';
import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @Inject('MEDIA_REPOSITORY')
    private readonly mediaRepository: Repository<Media>,
  ) {}

  /**
   * Create a new media and upload it to the server
   * @param createMediaDto
   * @param file
   */
  async create(
    file: Express.Multer.File,
    uploadMediaDto: UploadMediaDto,
  ): Promise<Media> {
    const fileData = await this.uploadFile(file, uploadMediaDto.filepath);

    const media = new Media();
    media.filename = fileData.filename;
    media.filepath = fileData.filepath;
    media.mimetype = fileData.mimetype;
    media.size = fileData.size;
    return await this.mediaRepository.save(media);
  }

  findByTitle(title: string) {
    return this.mediaRepository.findOne({
      where: {
        title,
      },
    });
  }

  findAll(query: PaginateQuery): Promise<Paginated<Media>> {
    return paginate(query, this.mediaRepository, {
      sortableColumns: [
        'id',
        'title',
        'filepath',
        'filename',
        'mimetype',
        'size',
        'createdAt',
        'updatedAt',
      ],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: [
        'title',
        'filepath',
        'filename',
        'mimetype',
        'size',
        'description',
      ],
      select: [
        'id',
        'title',
        'filepath',
        'filename',
        'mimetype',
        'size',
        'description',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOne(id: string): Promise<Media | null> {
    const media = await this.mediaRepository.findOne({
      where: {
        id,
      },
    });

    return media;
  }

  async update(uploadMediaDto: UploadMediaDto, file?: Express.Multer.File) {
    const media: Media = await this.findOne(uploadMediaDto.id);
    if (!media) return null;
    await this.deleteFile(MediaService.getUploadFullPath(media.filepath));
    const fileData = await this.uploadFile(file, uploadMediaDto.filepath);

    Object.assign(media, fileData);
    return await this.mediaRepository.save(media);
  }

  async deleteFile(path: string) {
    if (fs.existsSync(path)) fs.unlinkSync(path);
  }
  async remove(media: Media) {
    this.deleteFile(MediaService.getUploadFullPath(media.filepath));
    return await this.mediaRepository.delete(media.id);
  }

  async save(
    file: Express.Multer.File,
    uploadMediaDto: UploadMediaDto,
  ): Promise<Media | null> {
    const media = uploadMediaDto.id
      ? await this.findOne(uploadMediaDto.id)
      : null;
    if (media) return await this.update(uploadMediaDto, file);
    else return await this.create(file, uploadMediaDto);
  }
  static getUploadFullPath(filepath: string) {
    return process.cwd() + filepath;
  }

  /**
   * Upload a file and return the file data
   * @param file
   * @param filePath : Il faut un chemin relatif comme /uploads
   */
  async uploadFile(file: Express.Multer.File, filePath: string): Promise<any> {
    const uploadDir = filePath;
    const fullUploadPath = MediaService.getUploadFullPath(uploadDir);
    if (!fs.existsSync(fullUploadPath))
      fs.mkdirSync(fullUploadPath, { recursive: true });

    const fileExtension = path.extname(file.originalname);
    const filename = uuidv4() + fileExtension;
    const filepath = uploadDir + '/' + filename;
    const filesize = file.size;

    await fs.promises.writeFile(
      MediaService.getUploadFullPath(filepath),
      file.buffer,
    );

    const fileData = {
      filename,
      filepath,
      size: filesize,
      mimetype: file.mimetype,
    };
    return fileData;
  }
}
