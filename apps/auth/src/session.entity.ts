// session.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('sessions')
@Index(['userUuid'])
@Index(['refreshTokenHash'], { unique: true })
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userUuid!: string;

  @Column()
  refreshTokenHash!: string;

  @Column()
  jti!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  isRevoked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}