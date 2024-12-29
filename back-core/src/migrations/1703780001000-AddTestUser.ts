import { MigrationInterface, QueryRunner } from 'typeorm';
import { hashPassword } from '../utils/functions';
import { v4 as uuidv4 } from 'uuid';

export class AddTestUser1703780001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await hashPassword('test123');
    const userId = uuidv4();
    
    // Insérer l'utilisateur test avec un ID
    await queryRunner.query(`
      INSERT INTO user (id, first_name, last_name, email, password)
      VALUES ('${userId}', 'Test', 'User', 'user@test.com', '${hashedPassword}')
    `);

    // Récupérer l'ID du rôle User
    const roleId = await queryRunner.query(`
      SELECT id FROM role WHERE name = 'User'
    `);

    // Associer le rôle à l'utilisateur
    await queryRunner.query(`
      INSERT INTO user_roles_role (userId, roleId)
      VALUES ('${userId}', '${roleId[0].id}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM user WHERE email = 'user@test.com'
    `);
  }
} 