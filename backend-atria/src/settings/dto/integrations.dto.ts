import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateIntegrationsDto {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @IsUrl({ require_protocol: true }, { message: 'Invalid Slack webhook URL' })
  slackWebhookUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @IsUrl({ require_protocol: true }, { message: 'Invalid Discord webhook URL' })
  discordWebhookUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  notifyOnPostRejected?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyOnContractSigned?: boolean;
}
