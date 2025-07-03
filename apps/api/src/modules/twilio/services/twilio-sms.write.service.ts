import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';
import { ITwilioSMSWriteService } from '../interfaces';

@Injectable()
export class TwilioSMSWriteService implements ITwilioSMSWriteService {
  private readonly logger = new Logger(TwilioSMSWriteService.name);
  private readonly twilioClient: Twilio.Twilio;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.from = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    this.twilioClient = Twilio(accountSid, authToken);
  }

  async sendSms(to: string, body: string): Promise<void> {
    try {
      const result = await this.twilioClient.messages.create({
        body,
        to,
        from: this.from,
      });

      this.logger.log(`SMS sent successfully: ${result.sid}`);
    } catch (err: any) {
      this.logger.error(`Failed to send SMS: ${err?.message}`);
      throw err;
    }
  }
}
