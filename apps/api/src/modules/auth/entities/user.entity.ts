import { Entity, Column } from 'typeorm';
import { ROLES } from '@repo/shared/enums';
import { IsEmail, IsEnum, IsPhoneNumber } from 'class-validator';
import { BaseEntity } from './../../../type-orm';

@Entity()
export class Users extends BaseEntity {
  @Column({ nullable: false })
  @IsPhoneNumber()
  phone: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ nullable: true })
  @IsEnum(ROLES)
  role: ROLES;
}
