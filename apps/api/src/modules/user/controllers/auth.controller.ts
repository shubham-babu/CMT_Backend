import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AUTH_WRITE_SERVICE, IAuthWriteService } from '../interfaces';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators';
import { CreateUserDto, LoginDto, ResendOtpDto } from '../dtos';
import { VerifyCodeDto } from '../dtos/verify-code-dto';

@Controller('auth')
@ApiTags('user')
export class AuthController {
  constructor(
    @Inject(AUTH_WRITE_SERVICE)
    private readonly authWriteService: IAuthWriteService,
  ) {}

  @Post('register')
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
    return this.authWriteService.signUp(user);
  }

  @Post('verify-otp')
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
  async verifyOtp(@Body() payload: VerifyCodeDto) {
    return this.authWriteService.verifyCode(payload);
  }

  @Post('resend-otp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string' },
        diaCode: { type: 'string' },
      },
    },
  })
  @Public()
  async resendOtp(@Body() payload: ResendOtpDto) {
    return this.authWriteService.resendOtp(payload);
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string' },
        diaCode: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Public()
  async login(@Body() payload: LoginDto) {
    return this.authWriteService.login(payload);
  }
}
