import { Country } from '../entities/country.entity';

export interface ICountryReadService {
  findById: (id: number) => Promise<Country>;
}
