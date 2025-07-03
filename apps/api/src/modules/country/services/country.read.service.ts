import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICountryReadService } from '../interfaces';
import { Country } from '../entities';

@Injectable()
export class CountryReadService implements ICountryReadService {
  constructor(
    @InjectRepository(Country)
    private readonly repo: Repository<Country>,
  ) {}

  public findById = async (id: number): Promise<Country> => {
    return await this.repo.findOne({
      where: { id },
    });
  };
}
