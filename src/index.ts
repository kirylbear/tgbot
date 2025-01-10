import * as dotenv from 'dotenv';
// src/index.ts
import  bot  from './bot/telegramBot'; // Именованный импорт

dotenv.config();

bot.launch()
  .then(() => console.log('Бот успешно запущен!'))
  .catch((error: unknown) => console.error('Ошибка запуска бота:', error));

