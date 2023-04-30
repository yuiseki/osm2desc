"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const _1 = require(".");
const argv = (0, yargs_1.default)(process.argv.slice(2))
    .option("id", {
    type: "string",
    alias: "i",
    description: "ID of a node, a way or a relation on the OpenStreetMap (node/1234, way/1234, relation/1234)",
})
    .help()
    .parseSync();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const input = argv._[0];
    if (!input || input === "") {
        console.info("Usage:");
        console.info("\tosm2desc [osm_id] {options}");
        console.info("\tosm2desc --help");
        process.exit(1);
    }
    const output = yield (0, _1.osm2desc)(input);
    console.log(output);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield main();
    }
    catch (error) {
        console.error(error);
    }
}))();
