import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncSchema1720460456663 implements MigrationInterface {
    name = 'SyncSchema1720460456663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_72a26c7d9fb2a68bec390c4b130\``);
        await queryRunner.query(`DROP INDEX \`REL_72a26c7d9fb2a68bec390c4b13\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`associationId\``);
        await queryRunner.query(`ALTER TABLE \`association\` ADD CONSTRAINT \`FK_6879674c7109f0cd3273e057d09\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`association\` DROP FOREIGN KEY \`FK_6879674c7109f0cd3273e057d09\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`associationId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_72a26c7d9fb2a68bec390c4b13\` ON \`user\` (\`associationId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_72a26c7d9fb2a68bec390c4b130\` FOREIGN KEY (\`associationId\`) REFERENCES \`association\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
