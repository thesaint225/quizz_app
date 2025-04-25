"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hashPassword() {
    try {
        const userPassword = "johnthe454";
        // generate salt with strength of 10
        const salt = await bcrypt_1.default.genSalt(10);
        // hash the the password
        const hashedPassword = await bcrypt_1.default.hash("userPassword", salt);
        console.log("Hashed password:", hashedPassword);
    }
    catch (error) {
        console.error("Error hashing password", error);
    }
}
hashPassword();
