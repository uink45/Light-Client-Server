"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidTestcases = exports.getValidTestcases = exports.parseInvalidTestcase = exports.parseValidTestcase = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const ssz_1 = require("@chainsafe/ssz");
const snappyjs_1 = require("snappyjs");
const util_1 = require("./util");
function parseValidTestcase(path, type) {
    // The root is stored in meta.yml as:
    //   root: 0xDEADBEEF
    const meta = (0, util_1.loadYamlFile)((0, path_1.join)(path, "meta.yaml"));
    const root = (0, ssz_1.fromHexString)(meta.root);
    // The serialized value is stored in serialized.ssz_snappy
    const serialized = (0, snappyjs_1.uncompress)((0, fs_1.readFileSync)((0, path_1.join)(path, "serialized.ssz_snappy")));
    // The value is stored in value.yml
    const value = type.fromJson((0, util_1.loadYamlFile)((0, path_1.join)(path, "value.yaml")));
    return {
        path,
        root,
        serialized,
        value,
    };
}
exports.parseValidTestcase = parseValidTestcase;
function parseInvalidTestcase(path) {
    // The serialized value is stored in serialized.ssz_snappy
    const serialized = (0, snappyjs_1.uncompress)((0, fs_1.readFileSync)((0, path_1.join)(path, "serialized.ssz_snappy")));
    return {
        path,
        serialized,
    };
}
exports.parseInvalidTestcase = parseInvalidTestcase;
function getValidTestcases(path, prefix, type) {
    const subdirs = (0, fs_1.readdirSync)(path);
    return subdirs
        .filter((dir) => dir.includes(prefix))
        .map((d) => (0, path_1.join)(path, d))
        .map((p) => parseValidTestcase(p, type));
}
exports.getValidTestcases = getValidTestcases;
function getInvalidTestcases(path, prefix) {
    const subdirs = (0, fs_1.readdirSync)(path);
    return subdirs
        .filter((dir) => dir.includes(prefix))
        .map((d) => (0, path_1.join)(path, d))
        .map(parseInvalidTestcase);
}
exports.getInvalidTestcases = getInvalidTestcases;
//# sourceMappingURL=sszGeneric.js.map