export interface ITwilioOtpService {
  sendOtp: (phone: string, code: string) => Promise<void>;
}
