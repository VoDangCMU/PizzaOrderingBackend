"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @type {import('ts-jest').JestConfigWithTsJest} **/
const ts_jest_1 = require("ts-jest");
const fs_1 = __importDefault(require("fs"));
const decomment_1 = __importDefault(require("decomment"));
const data = JSON.parse((0, decomment_1.default)(fs_1.default.readFileSync("./tsconfig.json", 'utf8')));
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    roots: ['<rootDir>'],
    modulePaths: [data.compilerOptions.baseUrl],
    moduleNameMapper: (0, ts_jest_1.pathsToModuleNameMapper)(data.compilerOptions.paths)
};
