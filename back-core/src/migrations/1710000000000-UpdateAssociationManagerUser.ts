import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAssociationManagerUser1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Récupérer l'ID de l'association "Urgence Palestine"
        const association = await queryRunner.query(
            `SELECT id FROM association WHERE name = 'Urgence Palestine' LIMIT 1`
        );

        if (association && association[0]) {
            // Mettre à jour l'utilisateur avec l'associationId
            await queryRunner.query(
                `UPDATE user 
                 SET associationId = ? 
                 WHERE email = 'associationmanager@test.com'`,
                [association[0].id]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Réinitialiser l'associationId à null pour cet utilisateur
        await queryRunner.query(
            `UPDATE user 
             SET associationId = NULL 
             WHERE email = 'associationmanager@test.com'`
        );
    }
} 