import Sequelize, { Model } from 'sequelize';
import bcrypte from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // It wont be in DB
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Before save a user
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypte.hash(user.password, 8);
      }
    });
    return this;
  }
}

export default User;
