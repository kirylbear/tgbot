import { Telegraf } from 'telegraf';
import { processUserMessage } from '../services/dialogChain';
import { checkAvailability, getAvailableSlots, createAppointment } from '../services/googleCalendar';
import { extractDateTime } from '../utils/dateUtils';

// Глобальные переменные для отслеживания состояния
let isPendingConfirmation: boolean = false; // Ожидание подтверждения записи
let pendingDateTime: string | null = null; // Время, ожидающее подтверждения

const bot = new Telegraf("8085094573:AAGFuSDaEFcH1mAk6fApId3QLeryvUF1yQo");

bot.start((ctx) => {
  ctx.reply('Привет! Я помогу вам записаться на услуги депиляции. Напишите, когда вам удобно.');
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text.toLowerCase();
  let dateTime: string | null = null;

  try {
    // Если ожидается подтверждение
    if (isPendingConfirmation) {
      if (userMessage === 'да' && pendingDateTime) {
        // Подтверждаем запись
        await createAppointment(ctx.message.from.first_name, pendingDateTime);

        // Генерируем окончательное сообщение с помощью ChatGPT
        const chatResponse = await processUserMessage(`Запись подтверждена на ${pendingDateTime}.`, {
          userName: ctx.message.from.first_name,
          dateTime: pendingDateTime,
          isConfirmed: true,
        });

        ctx.reply(chatResponse);

        // Сбрасываем состояние
        isPendingConfirmation = false;
        pendingDateTime = null;
      } else {
        // Если пользователь не подтверждает, сбрасываем состояние
        ctx.reply("Запись не подтверждена. Если хотите записаться, укажите новое время.");
        isPendingConfirmation = false;
        pendingDateTime = null;
      }
      return;
    }

    // Пробуем извлечь дату/время из сообщения пользователя
    let chatResponse = await processUserMessage(userMessage);
    dateTime = extractDateTime(chatResponse, userMessage);

    if (dateTime) {
      // Проверяем доступность времени через Google Calendar
      const isAvailable = await checkAvailability(dateTime);

      if (isAvailable) {
        // Обновляем контекст для ChatGPT
        chatResponse = await processUserMessage(userMessage, {
          isAvailable: true,
          dateTime,
        });

        ctx.reply(chatResponse);
        pendingDateTime = dateTime;
        isPendingConfirmation = true;
      } else {
        // Если время занято, получаем ближайшие свободные интервалы
        const availableSlots = await getAvailableSlots(dateTime);

        if (availableSlots.length > 0) {
          const formattedSlots = availableSlots
            .slice(0, 5)
            .map((slot) => new Date(slot).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
            .join(', ');

          chatResponse = await processUserMessage(userMessage, {
            isAvailable: false,
            dateTime,
            availableSlots,
          });

          ctx.reply(chatResponse);
        } else {
          ctx.reply("К сожалению, на сегодня нет свободных интервалов.");
        }
      }
    } else {
      // Если дата/время не распознаны, продолжаем общение с ChatGPT
      ctx.reply(chatResponse);
    }
  } catch (error) {
    console.error('Ошибка при обработке сообщения:', error);
    ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
});

export default bot;