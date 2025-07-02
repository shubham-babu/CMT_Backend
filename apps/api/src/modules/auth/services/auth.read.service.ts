import {Injectable } from '@nestjs/common';

import { IAuthReadService } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class AuthReadService implements IAuthReadService {
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  public findUserByPhoneOrEmail = async (phone: string, email: string): Promise<User> => {
    return await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });
  }
}
