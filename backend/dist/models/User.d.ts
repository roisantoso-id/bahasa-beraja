import { Model, Optional } from 'sequelize';
export interface UserAttributes {
    id: number;
    username: string;
    email?: string;
    password_hash?: string;
    display_name: string;
    avatar_url?: string;
    phone?: string;
    country: string;
    language: string;
    timezone: string;
    status: 'active' | 'disabled' | 'pending';
    role: 'user' | 'vip' | 'admin' | 'super_admin';
    email_verified: boolean;
    phone_verified: boolean;
    balance: number;
    vip_level: number;
    vip_expire_at?: Date;
    total_recharge: number;
    total_consumption: number;
    login_count: number;
    last_login_at?: Date;
    total_study_time: number;
    streak_days: number;
    longest_streak: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    username: string;
    email?: string;
    password_hash?: string;
    display_name: string;
    avatar_url?: string;
    phone?: string;
    country: string;
    language: string;
    timezone: string;
    status: 'active' | 'disabled' | 'pending';
    role: 'user' | 'vip' | 'admin' | 'super_admin';
    email_verified: boolean;
    phone_verified: boolean;
    balance: number;
    vip_level: number;
    vip_expire_at?: Date;
    total_recharge: number;
    total_consumption: number;
    login_count: number;
    last_login_at?: Date;
    total_study_time: number;
    streak_days: number;
    longest_streak: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map