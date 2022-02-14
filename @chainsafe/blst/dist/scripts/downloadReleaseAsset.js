"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReleaseAsset = void 0;
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const paths_1 = require("./paths");
const githubReleasesDownloadUrl = "https://github.com/ChainSafe/blst-ts/releases/download";
async function downloadReleaseAsset(assetName, binaryPath) {
    // eslint-disable-next-line
    const packageJson = require(paths_1.PACKAGE_JSON_PATH);
    const version = packageJson.version;
    const assetUrl = `${githubReleasesDownloadUrl}/v${version}/${assetName}`;
    paths_1.ensureDirFromFilepath(binaryPath);
    const res = await node_fetch_1.default(assetUrl);
    // Accept redirects (3xx)
    if (res.status >= 400) {
        throw Error(`${res.status} ${res.statusText}`);
    }
    const dest = fs_1.default.createWriteStream(binaryPath);
    res.body.pipe(dest);
}
exports.downloadReleaseAsset = downloadReleaseAsset;
//# sourceMappingURL=downloadReleaseAsset.js.map