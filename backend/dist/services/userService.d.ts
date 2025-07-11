import { UserAttributes } from '../models/User';
export interface RegisterData {
    username: string;
    email?: string;
    password?: string;
    display_name: string;
    phone?: string;
    country?: string;
    language?: string;
    timezone?: string;
}
export interface LoginData {
    username: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: number;
        username: string;
        display_name: string;
        email?: string;
        avatar_url?: string;
        role: string;
        status: string;
        balance: number;
        vip_level: number;
        login_count: number;
        last_login_at?: Date;
    };
    token: string;
    refresh_token: string;
}
export declare class UserService {
    static register(data: RegisterData): Promise<AuthResponse>;
    static login(data: LoginData): Promise<AuthResponse>;
    static getUserById(id: number): Promise<UserAttributes | null>;
    static getUserByUsername(username: string): Promise<UserAttributes | null>;
    static updateUser(id: number, data: Partial<UserAttributes>): Promise<UserAttributes | null>;
    private static generateToken;
    private static generateRefreshToken;
    static verifyToken(token: string): any;
    static refreshToken(refreshToken: string): Promise<{
        token: string;
        refresh_token: string;
    }>;
}
//# sourceMappingURL=userService.d.ts.map