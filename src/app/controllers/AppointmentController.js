import * as Yup from 'Yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async index(req, res) {
    const appointment = await Appointment.findAll();
    res.json(appointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error:
          'Você não pode criar um agendamento para um usuário que não é prestador de serviço',
      });
    }

    const hourStart = startOfHour(parseISO(date));
    /**
     * Verifica se data é anterior a atual
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Data não permitida!' });
    }

    /**
     *
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Data não está disponivel!' });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
