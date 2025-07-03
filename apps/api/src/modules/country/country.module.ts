import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities';
import { COUNTRY_READ_SERVIcE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { CountryReadService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), ConfigModule],
  providers: [{ provide: COUNTRY_READ_SERVIcE, useClass: CountryReadService }],
  exports: [COUNTRY_READ_SERVIcE],
})
export class CountryModule {}
