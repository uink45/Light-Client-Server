"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDirExists = exports.writeFile600Perm = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Create a file with `600 (-rw-------)` permissions
 * *Note*: 600: Owner has full read and write access to the file,
 * while no other user can access the file
 */
function writeFile600Perm(filepath, data) {
    ensureDirExists(path_1.default.dirname(filepath));
    fs_1.default.writeFileSync(filepath, data);
    fs_1.default.chmodSync(filepath, "0600");
}
exports.writeFile600Perm = writeFile600Perm;
/**
 * If `dirPath` does not exist, creates a directory recursively
 */
function ensureDirExists(dirPath) {
    if (!fs_1.default.existsSync(dirPath))
        fs_1.default.mkdirSync(dirPath, { recursive: true });
}
exports.ensureDirExists = ensureDirExists;
//# sourceMappingURL=fs.js.map