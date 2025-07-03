import { Body, Controller, Inject, Post } from '@nestjs/common';
import { USER_WRITE_SERVICE, IUserWriteService } from '../interfaces';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from './../../../decorators';
import { CreateUserDto } from '../dtos';
import { VerifyCodeDto } from '../dtos/verify-code-dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    @Inject(USER_WRITE_SERVICE)
    private readonly userWriteService: IUserWriteService,
  ) {}

  @Post('sign-up')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        countryId: { type: 'string' },
      },
    },
  })
  @Public()
  async signUp(@Body() user: CreateUserDto) {
    return this.userWriteService.signUp(user);
  }

  @Post('verify-code')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string' },
        diaCode: { type: 'string' },
        code: { type: 'string' },
      },
    },
  })
  @Public()
  async verifyCode(@Body() payload: VerifyCodeDto) {
    return this.userWriteService.verifyCode(payload);
  }
}
