"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeMultiSpec = void 0;
const chai_1 = require("chai");
const util_1 = require("./util");
/**
 * Run yaml Eth2.0 bulk spec tests (m) for a certain function
 * Compares actual vs expected for all test cases
 * @param {string} testYamlPath - path to yaml spec test
 * @param {Function} testFunc - function to use to generate output
 * @param {Function} getInput - function to convert test case into input array
 * @param {Function} getExpected - function to convert test case into a
 *   comparable expected output
 * @param {Function} getActual - function to convert function output into
 *   comparable actual output
 * @param {Function} shouldError - function to convert test case into a
 *   boolean, if the case should result in an error
 * @param {Function} shouldSkip - function to convert test case into a boolean,
 *   if the case should be skipped
 * @param {Function} expectFunc - function to run expectations against expected
 *   and actual output
 * @param timeout - how long to wait before marking tests as failed (default 2000ms). Set to 0 to wait infinitely
 */
function describeMultiSpec(testYamlPath, testFunc, getInput, getExpected, getActual, shouldError = (testCase, index) => false, shouldSkip = (testCase, index) => false, expectFunc = (testCase, expect, expected, actual) => expect(actual).to.be.equal(expected), timeout = 10 * 60 * 1000) {
    const testSpec = (0, util_1.loadYamlFile)(testYamlPath);
    const testSuiteName = `${testSpec.runner} - ${testSpec.handler} - ${testSpec.title} - ${testSpec.config}`;
    describe(testSuiteName, function () {
        this.timeout(timeout);
        for (const [index, testCase] of testSpec.testCases.entries()) {
            if (shouldSkip(testCase, index)) {
                continue;
            }
            const description = index + (testCase.description ? " - " + testCase.description : "");
            it(description, function () {
                const inputs = getInput(testCase);
                if (shouldError(testCase, index)) {
                    (0, chai_1.expect)(testFunc.bind(null, ...inputs)).to.throw();
                }
                else {
                    const result = testFunc(...inputs);
                    const actual = getActual(result);
                    const expected = getExpected(testCase);
                    expectFunc(testCase, chai_1.expect, expected, actual);
                }
            });
        }
    });
}
exports.describeMultiSpec = describeMultiSpec;
//# sourceMappingURL=multi.js.map