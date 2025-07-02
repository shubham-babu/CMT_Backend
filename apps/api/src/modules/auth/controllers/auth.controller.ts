import { Controller, Inject } from '@nestjs/common';
import { AUTH_WRITE_SERVICE, IAuthWriteService } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_WRITE_SERVICE)
    private readonly authWriteService: IAuthWriteService,
  ) {}
}
