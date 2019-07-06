import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // Desestruct variable: ['Bearer','TOKENaSD122123']
  const [, token] = authHeader.split(' ');

  try {
    // Promisify return a function so we call it with the callback parameters.
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userID = decoded.id;
    req.session = decoded;

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
