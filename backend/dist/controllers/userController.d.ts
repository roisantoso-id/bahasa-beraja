import { Request, Response } from 'express';
export declare class UserController {
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static refreshToken(req: Request, res: Response): Promise<void>;
    static getProfile(req: Request, res: Response): Promise<void>;
    static updateProfile(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=userController.d.ts.map