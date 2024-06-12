import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Drug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  name: string;

  @Column('boolean', { nullable: false })
  approved: boolean;

  @Column('real', { nullable: false })
  min_dose: number;

  @Column('real', { nullable: false })
  max_dose: number;

  @Column('date', { nullable: false })
  available_at: Date;
}
