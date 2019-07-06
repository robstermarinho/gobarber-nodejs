import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // Yup data validation
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    // If user email was not found
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    // Check password using the User method
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name } = user;

    // Generate JWT token with header, payload and signature
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();
