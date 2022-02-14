"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePassword = void 0;
const buffer_1 = require("buffer");
function normalizePassword(password) {
    if (typeof password === "string") {
        return buffer_1.Buffer.from(password.normalize("NFKD"), "utf8");
    }
    else {
        return buffer_1.Buffer.from(password);
    }
}
exports.normalizePassword = normalizePassword;
