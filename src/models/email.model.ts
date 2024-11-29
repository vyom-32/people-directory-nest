import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Person } from './person.model';

@Table({
  tableName: 'Emails',
})
export class Email extends Model<Email> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Person)
  @Column({
    type: DataType.INTEGER,
  })
  personId: number;

  @BelongsTo(() => Person)
  person: Person;

  @Column({
    type: DataType.STRING,
  })
  emailType: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
