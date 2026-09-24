import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { type AuthenticatedUser } from './decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateInvitationTokenDto } from './dto/create-invitation-token.dto';
import { SignupWithTokenDto } from './dto/signup-with-token.dto';
import { ValidateInvitationTokenDto } from './dto/validate-invitation-token.dto';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    signupWithToken(dto: SignupWithTokenDto, res: Response): Promise<{
        user: import("./auth.service").UserResponse;
        accessToken: string;
        refreshToken: string;
    }>;
    validateInvitationToken(dto: ValidateInvitationTokenDto): Promise<{
        valid: boolean;
        role: import("@prisma/client").$Enums.RoleName;
        companyId: string;
        companyName: string;
        expiresAt: string;
    }>;
    createInvitationToken(user: AuthenticatedUser, dto: CreateInvitationTokenDto): Promise<{
        id: string;
        token: string;
        role: import("@prisma/client").$Enums.RoleName;
        companyId: string;
        used: boolean;
        expiresAt: string;
    }>;
    register(dto: RegisterDto): Promise<void>;
    login(dto: LoginDto, res: Response): Promise<{
        user: import("./auth.service").UserResponse;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(req: Request, dto: RefreshTokenDto, res: Response): Promise<{
        user: import("./auth.service").UserResponse;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: Request, dto: RefreshTokenDto, res: Response): Promise<void>;
    getProfile(user: AuthenticatedUser): Promise<import("./auth.service").UserResponse>;
    changePassword(user: AuthenticatedUser, dto: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
    private getRefreshCookieOptions;
    private setRefreshTokenCookie;
    private clearRefreshTokenCookie;
}
