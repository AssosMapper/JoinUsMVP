import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssociationIdToUser1703780000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('user', 'associationId');
    if (!hasColumn) {
      await queryRunner.query(`
        ALTER TABLE user 
        ADD COLUMN associationId varchar(36) NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('user', 'associationId');
    if (hasColumn) {
      await queryRunner.query(`
        ALTER TABLE user 
        DROP COLUMN associationId
      `);
    }
  }
} 