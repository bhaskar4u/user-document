import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { randomUUID } from 'crypto';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['uuid'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid' })
  uuid!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  setDefaults() {
    this.uuid = randomUUID();
    this.email = this.email.toLowerCase();
  }
}