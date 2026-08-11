import type { JwtPayload } from '../interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

export {};
