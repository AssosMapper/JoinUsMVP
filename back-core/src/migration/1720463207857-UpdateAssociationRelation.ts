import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAssociationRelation1720463207857 implements MigrationInterface {
    name = 'UpdateAssociationRelation1720463207857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`association\` DROP FOREIGN KEY \`FK_6879674c7109f0cd3273e057d09\``);
        await queryRunner.query(`ALTER TABLE \`association\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_72a26c7d9fb2a68bec390c4b130\` FOREIGN KEY (\`associationId\`) REFERENCES \`association\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_72a26c7d9fb2a68bec390c4b130\``);
        await queryRunner.query(`ALTER TABLE \`association\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`association\` ADD CONSTRAINT \`FK_6879674c7109f0cd3273e057d09\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
