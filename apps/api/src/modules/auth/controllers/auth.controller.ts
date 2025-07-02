import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AUTH_WRITE_SERVICE, IAuthWriteService } from '../interfaces';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from './../../../decorators';
import { CreateUserDto } from '../dtos';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_WRITE_SERVICE)
    private readonly authWriteService: IAuthWriteService,
  ) {}

  @Post("sign-up")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        phone: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        name: { type: "string" },
        role: { type: "string" },
        countryId: { type: "string"},
      },
    },
  })
  @Public()
  async signUp(@Body() user: CreateUserDto) {
    return this.authWriteService.signUp(user);
  }
}
