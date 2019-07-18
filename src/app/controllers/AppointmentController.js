import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pl';
import Appointment from '../models/Appointment';
import User from '../models/Users';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userID,
        canceled_at: null,
      },
      order: ['date'], // Order by date
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20, // Paginate 20 by 20
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { provider_id, date } = req.body;
    /**
     * Check if user id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers.' });
    }
    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }
    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available.' });
    }
    const appointment = await Appointment.create({
      user_id: req.userID,
      provider_id,
      date,
    });
    /**
     * Notify user when appointment is created
     */
    const user = await User.findByPk(req.userID);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', as' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `New appointment to ${user.name} in ${formattedDate} `,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    if (appointment.user_id !== req.userID) {
      return res
        .status(401)
        .json({ error: 'You can cannot cancel this appointment.' });
    }
    const dateLessTwotHours = subHours(appointment.date, 2);
    if (isBefore(dateLessTwotHours, new Date())) {
      return res.status(401).json({
        error: 'You can only canceL appointments 2 hours in advance.',
      });
    }
    appointment.canceled_at = new Date();
    await appointment.save();
    // BEFORE
    /*
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Cancelled Appointment',
      // text: 'You have a new cancelled appointment',
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', as' H:mm'h'", {
          locale: pt,
        }),
      },
    });
    */
    await Queue.add(CancellationMail.key, {
      appointment,
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
