import * as dotenv from 'dotenv';
dotenv.config();

import bot from './bot/telegramBot';

bot.launch()
  .then(() => console.log('Бот успешно запущен!'))
  .catch((error: unknown) => console.error('Ошибка запуска бота:', error));
