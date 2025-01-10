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
const telegraf_1 = require("telegraf");
const dialogChain_1 = require("../services/dialogChain");
const googleCalendar_1 = require("../services/googleCalendar");
const dateUtils_1 = require("../utils/dateUtils");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply('Привет! Я помогу вам записаться на услуги депиляции. Напишите, когда вам удобно.');
});
bot.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const userMessage = ctx.message.text;
    try {
        const response = yield (0, dialogChain_1.processUserMessage)(userMessage);
        if (response.includes('записаться')) {
            const dateTime = (0, dateUtils_1.extractDateTime)(response);
            const isAvailable = yield (0, googleCalendar_1.checkAvailability)(dateTime);
            if (isAvailable) {
                yield (0, googleCalendar_1.createAppointment)(ctx.message.from.first_name, dateTime);
                ctx.reply('Вы успешно записаны!');
            }
            else {
                ctx.reply('Это время занято. Попробуйте выбрать другое.');
            }
        }
        else {
            ctx.reply(response);
        }
    }
    catch (error) {
        console.error('Ошибка обработки:', error);
        ctx.reply('Произошла ошибка. Попробуйте позже.');
    }
}));
exports.default = bot;
