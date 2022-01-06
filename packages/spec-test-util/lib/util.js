"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadYamlFile = exports.isDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const lodestar_utils_1 = require("@chainsafe/lodestar-utils");
function isDirectory(path) {
    return fs_1.default.lstatSync(path).isDirectory();
}
exports.isDirectory = isDirectory;
function loadYamlFile(path) {
    return (0, lodestar_utils_1.loadYaml)(fs_1.default.readFileSync(path, "utf8"));
}
exports.loadYamlFile = loadYamlFile;
//# sourceMappingURL=util.js.map