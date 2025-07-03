import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  USER_READ_SERVICE,
  IUserReadService,
  IUserWriteService,
} from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import {
  IUserCreatePayload,
  IBaseResponse,
  IUserResponse,
  IUserVerifyCodePayload,
} from '@repo/shared/interfaces';
import * as bcrypt from 'bcrypt';
import {
  COUNTRY_READ_SERVIcE,
  ICountryReadService,
} from './../../country/interfaces';
import { USER_STATUS } from '@repo/shared/enums';

@Injectable()
export class UserWriteService implements IUserWriteService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(USER_READ_SERVICE)
    private readonly userReadService: IUserReadService,
    @Inject(COUNTRY_READ_SERVIcE)
    private readonly countryReadService: ICountryReadService,
  ) {}

  public signUp = async (
    payload: IUserCreatePayload,
  ): Promise<IBaseResponse<IUserResponse>> => {
    const { phone, countryId } = payload;
    const country = await this.countryReadService.findById(countryId);

    if (!country) {
      throw new BadRequestException('Country not found.');
    }
    const existingUser = await this.userReadService.findUserByPhone(phone);

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or phone already exists',
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Create the user entity
    await this.userRepository.insert({
      phone: payload.phone,
      email: payload.email,
      password_hash: hashedPassword,
      name: payload.name,
      role: payload.role,
      countryId,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User signed up successfully.',
    };
  };

  public verifyCode = async (
    payload: IUserVerifyCodePayload,
  ): Promise<IBaseResponse<IUserResponse>> => {
    const { phone, code, diaCode } = payload;

    const existingUser = await this.userReadService.findUserByPhone(
      phone,
      diaCode,
    );

    if (!existingUser) {
      throw new BadRequestException('User not found.');
    }

    const verifyCode = '9999';
    if (verifyCode !== code) {
      throw new BadRequestException('Invalid code.');
    }

    await this.userRepository.update(existingUser.id, {
      status: USER_STATUS.ACTIVE,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'User signed up successfully.',
    };
  };
}
