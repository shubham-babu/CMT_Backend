import { Injectable } from '@nestjs/common';

import { IUserReadService } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { IRequestUser } from '@repo/shared/interfaces';

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
      relations: ['country'],
    });
  };
  public findById = async (id: number): Promise<User> => {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['country'],
    });
  };

  public mapUserToResponse = (user: User): IRequestUser => {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      diaCode: user.country.diaCode,
      email: user.email,
      status: user.status,
    };
  };
}
