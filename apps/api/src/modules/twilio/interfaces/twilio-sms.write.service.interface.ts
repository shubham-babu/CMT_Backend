export interface ITwilioSMSWriteService {
  sendSms: (to: string, body: string) => Promise<void>;
}
