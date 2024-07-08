import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssociationIdToUser1720462236320 implements MigrationInterface {
    name = 'AddAssociationIdToUser1720462236320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`associationId\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`associationId\``);
    }

}
