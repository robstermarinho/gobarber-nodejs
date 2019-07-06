import User from '../models/Users';

class UserController {
  async store(req, res) {
    // Check User Exists
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists.',
      });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const user = await User.findOne({
      where: { id: req.userID },
    });
    return res.json({ ok: true, user });
  }
}

export default new UserController();
