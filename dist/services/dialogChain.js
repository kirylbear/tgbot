"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUserMessage = processUserMessage;
const openai_1 = require("@langchain/openai");
const chains_1 = require("langchain/chains");
const prompts_1 = require("@langchain/core/prompts");
const chat = new openai_1.ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY, // Ключ API OpenAI
    temperature: 0.7, // Контролируем креативность
});
const prompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
    prompts_1.SystemMessagePromptTemplate.fromTemplate("Ты - вежливый и дружелюбный бот, который помогает клиентам записаться на услуги депиляции. Уточняй дату, время, и проверь доступность."),
    prompts_1.HumanMessagePromptTemplate.fromTemplate("{input}"),
]);
const chain = new chains_1.ConversationChain({
    llm: chat, // Chat-модель OpenAI
    prompt, // Шаблон для обработки сообщений
});
function processUserMessage(userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield chain.call({ input: userMessage });
        return response.response;
    });
}
