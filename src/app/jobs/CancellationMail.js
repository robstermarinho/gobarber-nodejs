import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pl';
import Mail from '../../lib/Mail';

class CancellationMail {
  // We can return this variable wihtou the constructor
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log('QUEUE RUNNING!!');
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Cancelled Appointment',
      // text: 'You have a new cancelled appointment',
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', as' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
