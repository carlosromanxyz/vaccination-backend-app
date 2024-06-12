import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vaccination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { nullable: false })
  drug_id: string;

  @Column('real', { nullable: false })
  dose: number;

  @Column('date', { nullable: false })
  date: Date;
}
