"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const downloadBindings_1 = require("./downloadBindings");
const buildBindings_1 = require("./buildBindings");
const paths_1 = require("./paths");
const testBindings_1 = require("./testBindings");
/* eslint-disable no-console */
const libName = "BLST native bindings";
// CLI runner
install().then(() => process.exit(0), (e) => {
    console.log(e.stack);
    process.exit(1);
});
async function install() {
    const binaryPath = paths_1.getBinaryPath();
    // Check if bindings already downloaded or built
    if (fs_1.default.existsSync(binaryPath)) {
        try {
            await testBindings_1.testBindings(binaryPath);
            console.log(`Using existing ${libName} from ${binaryPath}`);
            return;
        }
        catch (e) {
            console.log(`Cached ${libName} not OK`);
        }
    }
    // Fetch pre-built bindings from remote repo
    try {
        console.log(`Retrieving ${libName}...`);
        await downloadBindings_1.downloadBindings(binaryPath);
        await testBindings_1.testBindings(binaryPath);
        console.log(`Successfully retrieved ${libName}`);
        return;
    }
    catch (e) {
        if (e.statusCode === 404) {
            console.error(`${libName} not available: ${e.message}`);
        }
        else {
            e.message = `Error importing ${libName}: ${e.message}`;
            console.error(e);
        }
    }
    // Build bindings locally from source
    try {
        console.log(`Building ${libName} from source...`);
        await buildBindings_1.buildBindings(binaryPath);
        await testBindings_1.testBindings(binaryPath);
        console.log(`Successfully built ${libName} from source`);
        return;
    }
    catch (e) {
        e.message = `Error building ${libName}: ${e.message}`;
        console.error(e);
    }
    // Fallback?
    throw Error(`Error downloading and building ${libName}. No fallback`);
}
//# sourceMappingURL=install.js.map