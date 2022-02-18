"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    addrVotesToUpdateEnr: 10,
    requestTimeout: 1 * 1000,
    requestRetries: 1,
    sessionTimeout: 86400 * 1000,
    sessionEstablishTimeout: 15 * 1000,
    sessionCacheCapacity: 2000,
    lookupParallelism: 3,
    lookupRequestLimit: 3,
    lookupNumResults: 16,
    lookupTimeout: 60 * 1000,
    pingInterval: 300 * 1000,
    enrUpdate: true,
};