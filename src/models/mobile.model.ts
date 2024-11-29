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
  tableName: 'Mobiles',
})
export class Mobile extends Model<Mobile> {
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
  mobileType: string;

  @Column({
    type: DataType.STRING,
  })
  mobile: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
