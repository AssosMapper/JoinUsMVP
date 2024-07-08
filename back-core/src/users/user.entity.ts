  import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
  import { Association } from '../associations/association.entity';
  import { Role } from '../roles/role.entity';

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    dateCreated: Date;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    roleId: number;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    zip: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    associationId: number;

    @OneToMany(() => Association, association => association.user)
    @JoinColumn({ name: 'associationId' })
    associations: Association[];

    constructor() {
      this.id = 0;
      this.first_name = '';
      this.last_name = '';
      this.dateCreated = new Date();
      this.email = '';
      this.password = '';
      this.role = new Role(); 
      this.phone = '';
      this.address = '';
      this.zip = '';
      this.country = '';
      this.roleId = 0;
    }
  }
