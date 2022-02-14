"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBindings = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const exec_1 = require("./exec");
const testBindings_1 = require("./testBindings");
const swig_1 = require("./swig");
const paths_1 = require("./paths");
/* eslint-disable no-console */
async function buildBindings(binaryPath) {
    if (process.env.BLST_WRAP_CPP_FORCE_BUILD && fs_1.default.existsSync(paths_1.BLST_WRAP_CPP_PREBUILD)) {
        console.log(`BLST_WRAP_CPP_FORCE_BUILD=true, cleaning existing BLST_WRAP_CPP_PREBUILD ${paths_1.BLST_WRAP_CPP_PREBUILD}`);
        fs_1.default.unlinkSync(paths_1.BLST_WRAP_CPP_PREBUILD);
    }
    // Make sure SWIG generated bindings are available or download from release assets
    if (fs_1.default.existsSync(paths_1.BLST_WRAP_CPP_PREBUILD)) {
        console.log(`BLST_WRAP_CPP_PREBUILD ${paths_1.BLST_WRAP_CPP_PREBUILD} exists, SWIG will be skipped`);
    }
    else {
        if (process.env.SWIG_SKIP_RUN) {
            throw Error(`Prebuild SWIG not found ${paths_1.BLST_WRAP_CPP_PREBUILD}`);
        }
        else {
            await swig_1.assertSupportedSwigVersion();
            console.log("Building bindings from src");
        }
    }
    // From https://github.com/sass/node-sass/blob/769f3a6f5a3949bd8e69c6b0a5d385a9c07924b4/scripts/build.js#L59
    const nodeJsExec = process.execPath;
    const nodeGypExec = require.resolve(path_1.default.join("node-gyp", "bin", "node-gyp.js"));
    console.log("Launching node-gyp", {
        nodeJsExec,
        nodeGypExec,
        cwd: paths_1.BINDINGS_DIR,
        BLST_WRAP_CPP_PREBUILD: paths_1.BLST_WRAP_CPP_PREBUILD,
    });
    await exec_1.exec(nodeJsExec, [nodeGypExec, "rebuild"], {
        cwd: paths_1.BINDINGS_DIR,
        env: { ...process.env, BLST_WRAP_CPP_PREBUILD: paths_1.BLST_WRAP_CPP_PREBUILD },
    });
    // The output of node-gyp is not at a predictable path but various
    // depending on the OS.
    const bindingsFileOutput = paths_1.findBindingsFile(paths_1.BINDINGS_DIR);
    // Copy built .node file to expected path
    paths_1.ensureDirFromFilepath(binaryPath);
    fs_1.default.copyFileSync(bindingsFileOutput, binaryPath);
    // Make sure downloaded bindings work
    await testBindings_1.testBindings(binaryPath);
}
exports.buildBindings = buildBindings;
//# sourceMappingURL=buildBindings.js.map