import { ConfigService } from '@nestjs/config';
import type { SendMailInput } from './mail.types';
export declare class MailService {
    private readonly config;
    private readonly logger;
    private smtpTransporter;
    constructor(config: ConfigService);
    sendInBackground(input: SendMailInput): void;
    send(input: SendMailInput): Promise<void>;
    private resolveProvider;
    private normalizeRecipients;
    private resolveFromAddress;
    private sendViaResend;
    private sendViaSmtp;
    private getSmtpTransporter;
    private sendViaEmailJs;
    private parseBoolean;
}
