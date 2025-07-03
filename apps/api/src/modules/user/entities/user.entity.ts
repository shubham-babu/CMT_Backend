import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ROLES, USER_STATUS } from '@repo/shared/enums';
import { IsEmail, IsEnum } from 'class-validator';
import { BaseEntity } from './../../../type-orm';
import { Country } from './../../country/entities';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ nullable: false })
  countryId: number;

  @OneToOne(() => Country, (country) => country.diaCode)
  @JoinColumn({
    name: 'countryId',
    foreignKeyConstraintName: 'FK_User_CountryId',
  })
  public country: Country;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ nullable: true, type: 'bigint' })
  supplierId: string;

  @Column({ nullable: false })
  @IsEnum(ROLES)
  role: ROLES;

  @Column({ nullable: false, default: USER_STATUS.UNVERIFIED })
  @IsEnum(ROLES)
  status: USER_STATUS;
}
