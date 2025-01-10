import { parse, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function extractDateTime(response: string, fallbackInput?: string): string | null {
  console.log("Ответ для извлечения даты/времени:", response);

  const now = new Date();
  let date: Date | null = null;

  // Обработка ключевых слов "завтра", "сегодня"
  if (response.toLowerCase().includes("завтра")) {
    date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (response.toLowerCase().includes("сегодня")) {
    date = now;
  }

  // Попытка извлечения конкретной даты, например "25 октября"
  const dateMatch = response.match(/(\d{1,2})\s+([а-яА-Я]+)/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = dateMatch[2];
    const parsedDate = parse(`${day} ${month} ${now.getFullYear()}`, 'd MMMM yyyy', new Date(), { locale: ru });
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }

  // Попытка извлечения времени, например "12:00", "12-00", "12 00"
  const timeMatch = response.match(/(\d{1,2})[:\-\s](\d{2})/);
  if (timeMatch && date) {
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    date.setHours(hours, minutes, 0, 0); // Устанавливаем часы и минуты
    const isoDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
    console.log("Извлечённая дата/время:", isoDate);
    return isoDate;
  }

  // Если время не указано, используем стандартное (например, 12:00)
  if (date) {
    date.setHours(12, 0, 0, 0); // Устанавливаем стандартное время
    const isoDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
    console.log("Извлечённая дата (по умолчанию):", isoDate);
    return isoDate;
  }

  // Если ничего не извлечено, попробуем использовать резервный ввод
  if (fallbackInput) {
    console.log("Попытка извлечь дату/время из резервного ввода:", fallbackInput);
    return extractDateTime(fallbackInput);
  }

  console.log("Дата/время не найдены.");
  return null;
}
