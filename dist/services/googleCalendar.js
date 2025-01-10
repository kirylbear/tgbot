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
exports.checkAvailability = checkAvailability;
exports.createAppointment = createAppointment;
const googleapis_1 = require("googleapis");
const calendar = googleapis_1.google.calendar('v3');
const auth = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
function checkAvailability(dateTime) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const events = yield calendar.events.list({
            auth,
            calendarId: 'primary',
            timeMin: dateTime,
            timeMax: new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString(),
        });
        return ((_a = events.data.items) === null || _a === void 0 ? void 0 : _a.length) === 0;
    });
}
function createAppointment(name, dateTime) {
    return __awaiter(this, void 0, void 0, function* () {
        yield calendar.events.insert({
            auth,
            calendarId: 'primary',
            requestBody: {
                summary: `Запись на депиляцию: ${name}`,
                start: { dateTime },
                end: { dateTime: new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString() },
            },
        });
    });
}
