import { Injectable } from '@nestjs/common';

import { IAuthWriteService } from '../interfaces';

@Injectable()
export class AuthWriteService implements IAuthWriteService {
  signIn: () => void;
}
