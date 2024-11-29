import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Email } from './models/email.model';
import { Person } from './models/person.model';
import { Address } from './models/address.model';
import { Mobile } from './models/mobile.model';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { CreatePersonDto } from './dtos/createPerson.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Email) private emailModel: typeof Email,
    @InjectModel(Person) private personModel: typeof Person,
    @InjectModel(Address) private addressModel: typeof Address,
    @InjectModel(Mobile) private mobileModel: typeof Mobile,
    private sequelize: Sequelize,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getPersonCount(params: { q: string }): Promise<Number> {
    const q = params.q?.trim() || null;
    const countRes = await this.personModel.count({
      ...(q && q.length
        ? {
            where: {
              fullName: {
                [Op.like]: `%${q}%`,
              },
            },
          }
        : {}),
    });
    console.log('countRes...', countRes);
    return countRes;
  }
  async deletedPersonCount(params: { q: string }): Promise<Number> {
    const q = params.q?.trim() || null;
    const whereCond: WhereOptions<Person> = {
      isDeleted: true,
    };
    if (q && q.length) {
      whereCond.fullName = {
        [Op.like]: `%${q}%`,
      };
    }
    const countRes = await this.personModel.unscoped().count({
      where: whereCond,
    });
    console.log('countRes...', countRes);
    return countRes;
  }
  async getPersonList(params: {
    skip: number;
    limit: number;
    q?: string;
  }): Promise<Person[]> {
    const { limit = 10, skip = 0 } = params;
    const q = params.q?.trim() || null;

    return await this.personModel.findAll({
      attributes: [
        'id',
        'firstName',
        'middleName',
        'lastName',
        'fullName',
        'dob',
        'gender',
        'createdAt',
      ],
      ...(q && q.length
        ? { where: { fullName: { [Op.like]: `%${q}%` } } }
        : {}),
      include: [
        {
          model: this.mobileModel,
          as: 'mobiles',
          attributes: ['id', 'personId', 'mobileType', 'mobile'],
          required: false,
        },
        {
          model: this.emailModel,
          as: 'emails',
          attributes: ['id', 'personId', 'emailType', 'email'],
          required: false,
        },
        {
          model: this.addressModel,
          as: 'addresses',
          attributes: [
            'id',
            'personId',
            'addressType',
            'address',
            'city',
            'state',
            'country',
            'pincode',
          ],
          required: false,
        },
      ],
      offset: skip,
      limit,
    });
  }
  async deletedPersonList(params: {
    skip: number;
    limit: number;
    q?: string;
  }): Promise<Person[]> {
    const { limit = 10, skip = 0 } = params;
    const q = params.q?.trim() || null;

    const whereCond: WhereOptions<Person> = {
      isDeleted: true,
    };
    if (q && q.length) {
      whereCond.fullName = { [Op.like]: `%${q}%` };
    }

    return await this.personModel.unscoped().findAll({
      attributes: [
        'id',
        'firstName',
        'middleName',
        'lastName',
        'fullName',
        'dob',
        'gender',
        'createdAt',
      ],
      where: whereCond,
      include: [
        {
          model: this.mobileModel,
          as: 'mobiles',
          attributes: ['id', 'personId', 'mobileType', 'mobile'],
          required: false,
        },
        {
          model: this.emailModel,
          as: 'emails',
          attributes: ['id', 'personId', 'emailType', 'email'],
          required: false,
        },
        {
          model: this.addressModel,
          as: 'addresses',
          attributes: [
            'id',
            'personId',
            'addressType',
            'address',
            'city',
            'state',
            'country',
            'pincode',
          ],
          required: false,
        },
      ],
      offset: skip,
      limit,
    });
  }
  async searchPersonList(params: {
    q: string;
  }): Promise<{ id: number; fullName: string }[]> {
    return await this.personModel.findAll({
      attributes: ['id', 'fullName'],
      where: {
        fullName: {
          [Op.like]: `%${params.q}%`,
        },
      },
      raw: true,
    });
  }
  async deletePerson(params: { ids: number[] }) {
    if (params.ids?.length) {
      await this.personModel.update(
        {
          deletedAt: new Date(),
          isDeleted: true,
        },
        {
          where: {
            id: params.ids,
          },
        },
      );
    }
  }
  async restorePerson(params: { ids: number[] }) {
    if (params.ids?.length) {
      await this.personModel.unscoped().update(
        {
          deletedAt: null,
          isDeleted: false,
        },
        {
          where: {
            id: params.ids,
          },
        },
      );
    }
  }
  async createPerson(params: CreatePersonDto): Promise<Person> {
    const { emails, mobiles, addresses, ...personDetails } = params;
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const createdPerson = (
        await this.personModel.create(personDetails, {
          transaction,
        })
      ).toJSON();
      if (emails?.length) {
        createdPerson.emails = await this.emailModel.bulkCreate(
          emails.map((email) => ({ ...email, personId: createdPerson.id })),
          {
            transaction,
          },
        );
      }
      if (mobiles?.length) {
        createdPerson.mobiles = await this.mobileModel.bulkCreate(
          mobiles.map((mobile) => ({ ...mobile, personId: createdPerson.id })),
          {
            transaction,
          },
        );
      }
      if (addresses?.length) {
        createdPerson.addresses = await this.addressModel.bulkCreate(
          addresses.map((address) => ({
            ...address,
            personId: createdPerson.id,
          })),
          {
            transaction,
          },
        );
      }
      await transaction.commit();
      return createdPerson;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
}
