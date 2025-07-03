import { Inject, Injectable } from '@nestjs/common';
import {
  ITwilioOtpService,
  ITwilioSMSWriteService,
  TWILIO_SMS_WRITE_SERVICE,
} from '../interfaces';

@Injectable()
export class TwilioOtpService implements ITwilioOtpService {
  constructor(
    @Inject(TWILIO_SMS_WRITE_SERVICE)
    private readonly twilioSMSService: ITwilioSMSWriteService,
  ) {}

  async sendOtp(phone: string, code: string): Promise<void> {
    const message = `Your OTP code is ${code}. It will expire in 5 minutes.`;
    await this.twilioSMSService.sendSms(phone, message);
  }
}
