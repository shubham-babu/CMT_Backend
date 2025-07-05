import {
  BadRequestException,
  HttpException,
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
import {
  ITranslateService,
  TRANSLATE_SERVICE,
} from 'src/modules/translate/interfaces';

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
    @Inject(TRANSLATE_SERVICE)
    private readonly translateService: ITranslateService,
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
    try {
      const country = await this.countryReadService.findById(countryId);

      if (!country) {
        throw new BadRequestException('Country not found.');
      }
      const existingUser = await this.userReadService.findUserByPhone(phone);
      console.log(this.translateService);
      if (existingUser) {
        throw new BadRequestException(
          await this.translateService.translate('auth.invalid.phone'),
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
        message: await this.translateService.translate('auth.success.login'),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  public resendOtp = async (
    payload: IResendOTPPayload,
  ): Promise<IBaseResponse<Record<string, string>>> => {
    try {
      const code = this.generateOtp();
      await this.setOtp(payload.phone, code);
      await this.twilioOptService.sendOtp(
        payload.diaCode + payload.phone,
        code,
      );
      return {
        statusCode: HttpStatus.OK,
        message: await this.translateService.translate('auth.success.login'),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  public verifyCode = async (
    payload: IUserVerifyCodePayload,
  ): Promise<IBaseResponse<IUserResponse>> => {
    const { phone, code, diaCode } = payload;
    try {
      const existingUser = await this.userReadService.findUserByPhone(
        phone,
        diaCode,
      );

      if (!existingUser) {
        throw new BadRequestException(
          await this.translateService.translate('auth.notFound.user'),
        );
      }

      const verifyCode = await this.getOtp(phone);
      if (verifyCode !== code) {
        throw new BadRequestException(
          await this.translateService.translate(
            'auth.invalid.verificationCode',
          ),
        );
      }

      await this.userRepository.update(existingUser.id, {
        status: USER_STATUS.ACTIVE,
      });

      return {
        statusCode: HttpStatus.OK,
        message: await this.translateService.translate(
          'auth.success.verificationCode',
        ),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  public async login(
    payload: ILoginPayload,
  ): Promise<IBaseResponse<IAuthResponse>> {
    const { phone, password, diaCode } = payload;
    try {
      const user = await this.userReadService.findUserByPhone(phone, diaCode);

      if (!user) {
        throw new UnauthorizedException(
          await this.translateService.translate('auth.invalid.credentials'),
        );
      }
      if (user.status != USER_STATUS.ACTIVE) {
        throw new UnauthorizedException('User not active.');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          await this.translateService.translate('auth.invalid.credentials'),
        );
      }

      const tokens = this.generateTokens(user);

      return {
        statusCode: HttpStatus.OK,
        message: await this.translateService.translate('auth.success.login'),
        data: tokens,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public refreshTokens = async (
    payload: IRefreshTokenPayload,
  ): Promise<IBaseResponse<IAuthResponse>> => {
    try {
      const requestUser: IRequestUser = await this.jwtService.verifyAsync(
        payload.refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.userReadService.findById(requestUser.id);

      return {
        statusCode: HttpStatus.OK,
        message: await this.translateService.translate(
          'auth.success.refreshToken',
        ),
        data: this.generateTokens(user),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
