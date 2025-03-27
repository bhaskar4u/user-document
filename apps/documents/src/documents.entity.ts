import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Documents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column({nullable:true})
  ownerId: number;

  @Column({ default: 'Pending' }) // Add status with a default value
  status: string;
}
