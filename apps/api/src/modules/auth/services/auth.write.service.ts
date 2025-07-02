import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AUTH_READ_SERVICE, IAuthReadService, IAuthWriteService } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { IAuthCredentials, IBaseResponse, IRequestUser } from '@repo/shared/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthWriteService implements IAuthWriteService {
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(AUTH_READ_SERVICE)
    private readonly authReadService: IAuthReadService,
  ) {}

  public signUp = async (payload: IAuthCredentials): Promise<IBaseResponse<IRequestUser>> => {
    const { email, phone, countryId} = payload;

    const existingUser = await this.authReadService.findUserByPhoneOrEmail(phone, email);

    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Create the user entity
    this.userRepository.insert({
      phone: payload.phone,
      email: payload.email,
      password_hash: hashedPassword,
      name: payload.name,
      role: payload.role,
      countryId
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: "User signed up successfully.",
    };
  }
}
