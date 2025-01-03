import { MigrationInterface, QueryRunner } from 'typeorm';
import { hashPassword } from '../utils/functions';
import { v4 as uuidv4 } from 'uuid';

export class AddTestUser1703780001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await queryRunner.query(`
      SELECT * FROM user WHERE email = 'user@test.com'
    `);

    if (existingUser.length === 0) {
      const hashedPassword = await hashPassword('test123');
      const userId = uuidv4();
      
      await queryRunner.query(`
        INSERT INTO user (id, first_name, last_name, email, password)
        VALUES ('${userId}', 'Test', 'User', 'user@test.com', '${hashedPassword}')
      `);

      const roleId = await queryRunner.query(`
        SELECT id FROM role WHERE name = 'User'
      `);

      if (roleId[0]) {
        await queryRunner.query(`
          INSERT INTO user_roles_role (userId, roleId)
          VALUES ('${userId}', '${roleId[0].id}')
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // D'abord supprimer la relation spécifique dans user_roles_role
    await queryRunner.query(`
      DELETE FROM user_roles_role 
      WHERE userId IN (
        SELECT id FROM user WHERE email = 'user@test.com'
      )
    `);

    // Ensuite supprimer l'utilisateur test
    await queryRunner.query(`
      DELETE FROM user WHERE email = 'user@test.com'
    `);
  }
} 