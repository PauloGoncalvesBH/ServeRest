import jwt from 'jsonwebtoken';
import { conf } from '../utils/conf';

const PRIVATE_KEY: string = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';

interface EmailSenha {
  email: string;
  senha: string;
}

export function createToken(emailSenha: EmailSenha): string {
  return jwt.sign(emailSenha, PRIVATE_KEY, { expiresIn: `${conf.tokenTimeout}s` });
}

export function verifyToken(authorization: string): string | object {
    return jwt.verify(authorization.split(' ')[1], PRIVATE_KEY);
    
  // return jwt.verify(authorization.split(' ')[1], PRIVATE_KEY, (err, decode) => (decode === undefined ? err : decode))
}
