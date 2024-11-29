import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Mobile } from './mobile.model';
import { Email } from './email.model';
import { Address } from './address.model';

@Table({
  tableName: 'Persons',
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
})
export class Person extends Model<Person> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(30),
  })
  firstName: string;

  @Column({
    type: DataType.STRING(30),
  })
  middleName: string;

  @Column({
    type: DataType.STRING(30),
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
  })
  fullName: string;

  @Column({
    type: DataType.DATEONLY,
  })
  dob: Date;

  @Column({
    type: DataType.ENUM('Male', 'Female'),
  })
  gender: 'Male' | 'Female';

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.DATE)
  deletedAt: Date;

  @Column(DataType.BOOLEAN)
  isDeleted: boolean;

  @HasMany(() => Mobile, 'personId')
  mobiles: Mobile[];

  @HasMany(() => Email, 'personId')
  emails: Email[];

  @HasMany(() => Address, 'personId')
  addresses: Address[];
}
