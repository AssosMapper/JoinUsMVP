import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToUser1742973344419 implements MigrationInterface {
    name = 'AddIsActiveToUser1742973344419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isActive\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isActive\``);
    }

}
