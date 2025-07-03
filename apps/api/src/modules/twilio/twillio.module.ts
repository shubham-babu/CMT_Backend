import { Module } from '@nestjs/common';
import { TWILIO_OTP_SERVICE, TWILIO_SMS_WRITE_SERVICE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { TwilioOtpService, TwilioSMSWriteService } from './services';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: TWILIO_SMS_WRITE_SERVICE, useClass: TwilioSMSWriteService },
    { provide: TWILIO_OTP_SERVICE, useClass: TwilioOtpService },
  ],
  exports: [TWILIO_SMS_WRITE_SERVICE, TWILIO_OTP_SERVICE],
})
export class TwilioModule {}
