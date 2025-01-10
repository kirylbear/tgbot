import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from "langchain/chains";
import { SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';

const chat = new ChatOpenAI({
  openAIApiKey: "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", // Ключ API OpenAI
  temperature: 0.7, // Контролируем креативность
  model: "gpt-4o-mini"
});

const prompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(`
    Ты вежливый и ответственный агент записи на услуги депиляции. Твоя задача — обрабатывать запросы клиентов, проверяя доступность времени через Google Calendar и предлагая подходящие варианты. Если время доступно, ты подтверждаешь запись. Если время занято, ты предлагаешь ближайшие доступные интервалы.
    пример 
    1. Если клиент пишет только часы и минуты, то имеет в виду сегоднешний день.
    2. Если клиент хочет отменить запись, то ты должен сообщить, чтобы он связался с салоном напрямую.
    3. Если клиент хочет изменить время, ты сообщаешь чтобы он связался с салоном напрямую.
    4. салон работает с 10:00 до 20:00.
    5. ранее время для записи 10:00, позднее 19:15.
    Вот как ты должен отвечать: 
    1. Если время доступно, спрашивай у клиента подтверждение его ответ должен быть "да".
    2. Если клиент подтверждает запись, сообщай, что запись успешно добавлена.
    3. Если время занято, предлагай ближайшие доступные интервалы. Если свободных интервалов нет, проси клиента указать другую дату или время.
    4. Всегда используй дружелюбный и уважительный тон.
    5. Всегда уточняй, подходит ли клиенту предложенное время, если ты предлагаешь интервалы.
    6. Если запись уже была создана и подтверждена, напомни клиенту, что запись уже есть.
    пример к 6 пункту: "если google calendar сообщает 'Создание записи для: Kirill время: 2025-01-10T15:00:00
Запись успешно добавлена в Google Calendar.
Входящее сообщение для обработки: Запись подтверждена на 2025-01-10T15:00:00.'
ты сообщаешь что я только что создал для вас записал на это время и с радость вас ждём"
 плохой пример к 6 пункту: твоего ответа (Хочу напомнить, что у вас уже есть запись на 10 января 2025 года в 15:00. Ждем вас с радостью! Если у вас возникли какие-либо вопросы или вам нужно изменить время, пожалуйста, дайте знать.)
  а правильный ответ будет (Я создал для вас запись на 10 января 2025  года в 15:00. Ждем вас с радостью! Если у вас возникли какие-либо вопросы или вам нужно изменить время, пожалуйста, дайте знать.)
  `),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const chain = new ConversationChain({
  llm: chat,
  prompt,
});

export async function processUserMessage(userMessage: string, context: any = {}): Promise<string> {
  console.log("Входящее сообщение для обработки:", userMessage);

  try {
    const input = {
      input: `
        ${userMessage}
        
        Контекст:
        Время: ${context.dateTime || "не указано"}
        Доступность: ${context.isAvailable ? "доступно" : "занято"}
        Свободные интервалы: ${context.availableSlots?.join(', ') || "нет"}
        Имя клиента: ${context.userName || "не указано"}
        Ожидание подтверждения: ${context.isPendingConfirmation ? "да" : "нет"}
      `,
    };

    const response = await chain.call(input);
    console.log("Ответ от ChatGPT:", response.response);
    return response.response;
  } catch (error) {
    console.error("Ошибка в LangChain:", error);
    throw error;
  }
}


