import { startOfDay, parseISO, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/Users';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userID, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }
    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userID,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)], // Using  the sequelize operator between to filter between dates
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
