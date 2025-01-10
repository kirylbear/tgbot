"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDateTime = extractDateTime;
function extractDateTime(response) {
    const match = response.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : '';
}
