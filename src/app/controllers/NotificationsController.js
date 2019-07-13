import User from '../models/Users';
import Notification from '../schemas/Notification';

class NotificationsController {
  async index(req, res) {
    /**
     * Check if user id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: req.userID, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only check notifications with providers.' });
    }

    const notifications = await Notification.find({
      user: req.userID,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }
}

export default new NotificationsController();
