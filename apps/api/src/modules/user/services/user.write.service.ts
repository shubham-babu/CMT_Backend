import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
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
  IAuthResponse,
  ILoginPayload,
  IRequestUser,
} from '@repo/shared/interfaces';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

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

  private generateTokens(user: User): IAuthResponse {
    const payload: IRequestUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      diaCode: user.country.diaCode,
      email: user.email,
      status: user.status,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    const decoded: Record<string, any> = jwt.decode(accessToken);

    return {
      accessToken,
      refreshToken,
      exp: decoded.exp,
    };
  }

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

  public async login(
    payload: ILoginPayload,
  ): Promise<IBaseResponse<IAuthResponse>> {
    const { phone, password, diaCode } = payload;

    const user = await this.userReadService.findUserByPhone(phone, diaCode);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    if (user.status != USER_STATUS.ACTIVE) {
      throw new UnauthorizedException('User not active.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const tokens = this.generateTokens(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful.',
      data: tokens,
    };
  }
}
