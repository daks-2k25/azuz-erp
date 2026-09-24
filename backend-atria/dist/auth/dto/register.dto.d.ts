export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    roleName?: 'MASTER' | 'ADMIN' | 'DESIGNER_MASTER' | 'DESIGNER_JUNIOR' | 'CRM' | 'EXTERNAL_CLIENT_CRM' | 'CLIENT';
}
