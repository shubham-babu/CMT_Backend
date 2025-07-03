import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from './../../../type-orm';

@Entity({ name: 'countries' })
@Unique('UQ_COUNTRY_DIAL_CODE', ['diaCode'])
export class Country extends BaseEntity {
  @Column({ nullable: false })
  diaCode: string;
}
