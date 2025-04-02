import { Request, Response, NextFunction } from 'express';

export const checkRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!req.user.roles || !req.user.roles.includes(role)) {
            res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
            return;
        }

        next();
    };
}; 