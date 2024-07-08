import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncSchema1720460456663 implements MigrationInterface {
    name = 'SyncSchema1720460456663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Désactiver les vérifications de clé étrangère
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS=0;`);

        // Supprimer la contrainte de clé étrangère si elle existe
        try {
            await queryRunner.query(`ALTER TABLE \`association\` DROP FOREIGN KEY \`FK_6879674c7109f0cd3273e057d09\``);
        } catch (error) {
            console.log('Foreign key FK_6879674c7109f0cd3273e057d09 does not exist');
        }

        // Supprimer l'index s'il existe
        try {
            await queryRunner.query(`DROP INDEX \`user_id\` ON \`association\``);
        } catch (error) {
            console.log('Index user_id does not exist');
        }

        // Réactiver les vérifications de clé étrangère
        await queryRunner.query(`SET FOREIGN_KEY_CHECKS=1;`);

        // Ajouter la nouvelle contrainte de clé étrangère
        await queryRunner.query(`ALTER TABLE \`association\` ADD CONSTRAINT \`FK_6879674c7109f0cd3273e057d09\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`association\` DROP FOREIGN KEY \`FK_6879674c7109f0cd3273e057d09\``);
        await queryRunner.query(`CREATE INDEX \`user_id\` ON \`association\` (\`user_id\`)`);
    }
}
