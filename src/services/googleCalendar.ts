import { google } from 'googleapis';

const calendar = google.calendar('v3');
const auth = new google.auth.OAuth2(
  "384732578674-igok6s2reibfkjg1um019o4ij14qchf2.apps.googleusercontent.com",
  "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"
);

auth.setCredentials({ refresh_token: "1//09E0hqxGQ7Y2KCgYIARAAGAkSNwF-L9IrjC17YQZxCeaV2euvaZS0tTMb8EYIIqoAAeFMcF8-OvB29K4A4hp4IJd4tbcSk8RSI60" });

const PROCEDURE_DURATION_MINUTES = 45; // Длительность процедуры в минутах

export async function checkAvailability(dateTime: string): Promise<boolean> {
  console.log("Проверка доступности времени:", dateTime);

  const timeMin = new Date(dateTime).toISOString();
  const timeMax = new Date(new Date(dateTime).getTime() + PROCEDURE_DURATION_MINUTES * 60 * 1000).toISOString();

  try {
    const events = await calendar.events.list({
      auth,
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log("События, найденные в это время:", events.data.items);
    return events.data.items?.length === 0; // Если нет событий, время доступно
  } catch (error: any) {
    console.error("Ошибка при проверке доступности:", error);
    throw new Error('Ошибка при проверке доступности времени.');
  }
}

export async function getAvailableSlots(dateTime: string): Promise<string[]> {
  console.log("Получение доступных временных интервалов...");

  const salonOpeningTime = new Date(dateTime);
  salonOpeningTime.setHours(12, 0, 0, 0); // Открытие салона: 12:00

  const salonClosingTime = new Date(dateTime);
  salonClosingTime.setHours(20, 0, 0, 0); // Закрытие салона: 20:00

  try {
    const events = await calendar.events.list({
      auth,
      calendarId: 'primary',
      timeMin: salonOpeningTime.toISOString(),
      timeMax: salonClosingTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log("События в рабочее время салона:", events.data.items);

    const busySlots = events.data.items?.map(event => ({
      start: new Date(event.start?.dateTime || event.start?.date!).getTime(),
      end: new Date(event.end?.dateTime || event.end?.date!).getTime(),
    })) || [];

    const freeSlots = [];
    let startTime = salonOpeningTime.getTime();

    for (const slot of busySlots) {
      if (startTime < slot.start) {
        freeSlots.push(new Date(startTime).toISOString());
      }
      startTime = slot.end;
    }

    if (startTime < salonClosingTime.getTime()) {
      freeSlots.push(new Date(startTime).toISOString());
    }

    console.log("Свободные интервалы:", freeSlots);
    return freeSlots;
  } catch (error) {
    console.error("Ошибка при получении доступных временных интервалов:", error);
    throw new Error('Не удалось получить доступные временные интервалы.');
  }
}

export async function createAppointment(name: string, dateTime: string): Promise<void> {
  console.log("Создание записи для:", name, "время:", dateTime);

  const timeStart = new Date(dateTime).toISOString();
  const timeEnd = new Date(new Date(dateTime).getTime() + PROCEDURE_DURATION_MINUTES * 60 * 1000).toISOString();

  try {
    await calendar.events.insert({
      auth,
      calendarId: 'primary',
      requestBody: {
        summary: `Запись на депиляцию: ${name}`,
        start: { dateTime: timeStart },
        end: { dateTime: timeEnd },
      },
    });

    console.log("Запись успешно добавлена в Google Calendar.");
  } catch (error: any) {
    console.error("Ошибка при создании записи:", error);
    throw new Error('Ошибка при создании записи в Google Calendar.');
  }
}