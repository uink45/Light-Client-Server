"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeDirectorySpecTest = exports.toExpandedInputType = exports.InputType = void 0;
const chai_1 = require("chai");
const fs_1 = require("fs");
const path_1 = require("path");
const snappyjs_1 = require("snappyjs");
const util_1 = require("./util");
/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-explicit-any,
  func-names */
var InputType;
(function (InputType) {
    InputType["SSZ"] = "ssz";
    InputType["SSZ_SNAPPY"] = "ssz_snappy";
    InputType["YAML"] = "yaml";
})(InputType = exports.InputType || (exports.InputType = {}));
function toExpandedInputType(inputType) {
    if (inputType.type) {
        return inputType;
    }
    return {
        type: inputType,
        treeBacked: false,
    };
}
exports.toExpandedInputType = toExpandedInputType;
const defaultOptions = {
    inputTypes: {},
    inputProcessing: {},
    sszTypes: {},
    getExpected: (testCase) => testCase,
    shouldError: () => false,
    shouldSkip: () => false,
    expectFunc: (testCase, expected, actual) => (0, chai_1.expect)(actual).to.be.deep.equal(expected),
    timeout: 10 * 60 * 1000,
};
function describeDirectorySpecTest(name, testCaseDirectoryPath, testFunction, options) {
    options = { ...defaultOptions, ...options };
    if (!(0, util_1.isDirectory)(testCaseDirectoryPath)) {
        throw new Error(`${testCaseDirectoryPath} is not directory`);
    }
    describe(name, function () {
        if (options.timeout !== undefined) {
            this.timeout(options.timeout || "10 min");
        }
        const testCases = (0, fs_1.readdirSync)(testCaseDirectoryPath)
            .map((name) => (0, path_1.join)(testCaseDirectoryPath, name))
            .filter(util_1.isDirectory);
        for (const [index, testCaseDirectory] of testCases.entries()) {
            generateTestCase(testCaseDirectory, index, testFunction, options);
        }
    });
}
exports.describeDirectorySpecTest = describeDirectorySpecTest;
function generateTestCase(testCaseDirectoryPath, index, testFunction, options) {
    const name = (0, path_1.basename)(testCaseDirectoryPath);
    it(name, function () {
        // some tests require to load meta.yaml first in order to know respective ssz types.
        const metaFilePath = (0, path_1.join)(testCaseDirectoryPath, "meta.yaml");
        let meta = undefined;
        if ((0, fs_1.existsSync)(metaFilePath)) {
            meta = (0, util_1.loadYamlFile)(metaFilePath);
        }
        let testCase = loadInputFiles(testCaseDirectoryPath, options, meta);
        if (options.mapToTestCase)
            testCase = options.mapToTestCase(testCase);
        if (options.shouldSkip && options.shouldSkip(testCase, name, index)) {
            this.skip();
            return;
        }
        if (options.shouldError && options.shouldError(testCase)) {
            try {
                testFunction(testCase, name);
            }
            catch (e) {
                return;
            }
        }
        else {
            const result = testFunction(testCase, name);
            if (!options.getExpected)
                throw Error("getExpected is not defined");
            if (!options.expectFunc)
                throw Error("expectFunc is not defined");
            const expected = options.getExpected(testCase);
            options.expectFunc(testCase, expected, result);
        }
    });
}
function loadInputFiles(directory, options, meta) {
    const testCase = {};
    (0, fs_1.readdirSync)(directory)
        .map((name) => (0, path_1.join)(directory, name))
        .filter((file) => {
        var _a;
        if ((0, util_1.isDirectory)(file)) {
            return false;
        }
        if (!options.inputTypes)
            throw Error("inputTypes is not defined");
        const name = (0, path_1.parse)(file).name;
        const inputType = toExpandedInputType((_a = options.inputTypes[name]) !== null && _a !== void 0 ? _a : InputType.SSZ_SNAPPY);
        // set options.inputTypes[name] with expanded input type
        options.inputTypes[name] = inputType;
        const extension = inputType.type;
        return file.endsWith(extension);
    })
        .forEach((file) => {
        const inputName = (0, path_1.basename)(file).replace(".ssz_snappy", "").replace(".ssz", "").replace(".yaml", "");
        const inputType = getInputType(file);
        testCase[inputName] = deserializeInputFile(file, inputName, inputType, options, meta);
        switch (inputType) {
            case InputType.SSZ:
                testCase[`${inputName}_raw`] = (0, fs_1.readFileSync)(file);
                break;
            case InputType.SSZ_SNAPPY:
                testCase[`${inputName}_raw`] = (0, snappyjs_1.uncompress)((0, fs_1.readFileSync)(file));
                break;
        }
        if (!options.inputProcessing)
            throw Error("inputProcessing is not defined");
        if (options.inputProcessing[inputName] !== undefined) {
            testCase[inputName] = options.inputProcessing[inputName](testCase[inputName]);
        }
    });
    return testCase;
}
function getInputType(filename) {
    if (filename.endsWith(InputType.YAML)) {
        return InputType.YAML;
    }
    else if (filename.endsWith(InputType.SSZ_SNAPPY)) {
        return InputType.SSZ_SNAPPY;
    }
    else if (filename.endsWith(InputType.SSZ)) {
        return InputType.SSZ;
    }
    throw new Error(`Could not get InputType from ${filename}`);
}
function deserializeInputFile(file, inputName, inputType, options, meta) {
    var _a;
    if (inputType === InputType.YAML) {
        return (0, util_1.loadYamlFile)(file);
    }
    else if (inputType === InputType.SSZ || inputType === InputType.SSZ_SNAPPY) {
        const sszTypes = options.getSszTypes ? options.getSszTypes(meta) : options.sszTypes;
        if (!sszTypes)
            throw Error("sszTypes is not defined");
        let data = (0, fs_1.readFileSync)(file);
        if (inputType === InputType.SSZ_SNAPPY) {
            data = (0, snappyjs_1.uncompress)(data);
        }
        let sszType;
        for (const key of Object.keys(sszTypes)) {
            // most tests configure with exact match
            // fork_choice tests configure with regex
            if ((key.startsWith("^") && inputName.match(key)) || inputName === key) {
                sszType = sszTypes[key];
                break;
            }
        }
        if (sszType) {
            if (((_a = options.inputTypes) === null || _a === void 0 ? void 0 : _a[inputName]).treeBacked) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                return sszType.createTreeBackedFromBytes(data);
            }
            else {
                return sszType.deserialize(data);
            }
        }
        else {
            throw Error("Cannot find ssz type for inputName " + inputName);
        }
    }
}
//# sourceMappingURL=single.js.map