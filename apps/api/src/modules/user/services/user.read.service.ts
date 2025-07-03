import { Injectable } from '@nestjs/common';

import { IUserReadService } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserReadService implements IUserReadService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public findUserByPhone = async (
    phone: string,
    diaCode?: string,
  ): Promise<User> => {
    return await this.userRepository.findOne({
      where: { phone, country: { diaCode } },
    });
  };
}
