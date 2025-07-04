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
  IAuthWriteService,
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
  IResendOTPPayload,
  IRefreshTokenPayload,
} from '@repo/shared/interfaces';
import * as bcrypt from 'bcrypt';
import {
  COUNTRY_READ_SERVIcE,
  ICountryReadService,
} from '../../country/interfaces';
import { USER_STATUS } from '@repo/shared/enums';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ITwilioOtpService, TWILIO_OTP_SERVICE } from '../../twilio/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthWriteService implements IAuthWriteService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(USER_READ_SERVICE)
    private readonly userReadService: IUserReadService,
    @Inject(COUNTRY_READ_SERVIcE)
    private readonly countryReadService: ICountryReadService,
    @InjectRedis() private readonly redis: Redis,
    @Inject(TWILIO_OTP_SERVICE)
    private readonly twilioOptService: ITwilioOtpService,
    private readonly jwtService: JwtService,
  ) {}

  private generateOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };
  private setOtp = async (phone: string, code: string) => {
    await this.redis.set(`OTP:${phone}`, code, 'EX', 300);
  };
  private getOtp = async (phone: string) => {
    return await this.redis.get(`OTP:${phone}`);
  };

  private generateTokens(user: User): IAuthResponse {
    const payload = this.userReadService.mapUserToResponse(user);

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const decoded: Record<string, any> = this.jwtService.decode(accessToken);

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

    const code = this.generateOtp();
    await this.setOtp(phone, code);
    await this.twilioOptService.sendOtp(country.diaCode + phone, code);
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

  public resendOtp = async (
    payload: IResendOTPPayload,
  ): Promise<IBaseResponse<Record<string, string>>> => {
    const code = this.generateOtp();
    await this.setOtp(payload.phone, code);
    await this.twilioOptService.sendOtp(payload.diaCode + payload.phone, code);
    return {
      statusCode: HttpStatus.OK,
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

    const verifyCode = await this.getOtp(phone);
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

  public refreshTokens = async (
    payload: IRefreshTokenPayload,
  ): Promise<IBaseResponse<IAuthResponse>> => {
    const requestUser: IRequestUser = await this.jwtService.verifyAsync(
      payload.refreshToken,
      {
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    const user = await this.userReadService.findById(requestUser.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Refresh Token generated successfully.',
      data: this.generateTokens(user),
    };
  };
}
