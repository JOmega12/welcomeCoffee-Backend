"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const zod_express_middleware_1 = require("zod-express-middleware");
const db_setup_1 = require("../prisma/db.setup");
const bcrypt = __importStar(require("bcrypt"));
const auth_utils_1 = require("../auth.utils");
const authController = (0, express_1.Router)();
exports.authController = authController;
// !this logins
authController.post("/auth/login", 
// this makes sure that there is both username and password as well as it being strictly string and not a number
(0, zod_express_middleware_1.validateRequest)({
    body: zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    }),
}), ({ body: { username: bodyUsername, password: bodyPassword } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_setup_1.prisma.user.findFirst({
        where: {
            username: bodyUsername,
        },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = yield bcrypt.compare(bodyPassword, user.passwordHash);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    //this creates the user information that is being put
    const userInformation = (0, auth_utils_1.createUnsecuredUserInformation)(user);
    // this creates the token for the user
    const token = (0, auth_utils_1.createTokenForUser)(user);
    return res.status(200).json({ token, userInformation });
}));
// !this signups
authController.post("/auth/signup", 
// this makes sure that there is both username and password as well as it being strictly string and not a number
(0, zod_express_middleware_1.validateRequest)({
    body: zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    }),
}), ({ body: { username: bodyUsername, password: bodyPassword } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield db_setup_1.prisma.user.findFirst({
        where: {
            username: bodyUsername,
        },
    });
    if (existingUser) {
        return res
            .status(404)
            .json({ message: "Username is already registered" });
    }
    // this takes on the password that is being written
    const passwordHash = yield (0, auth_utils_1.encryptPassword)(bodyPassword);
    const user = yield db_setup_1.prisma.user.create({
        data: {
            username: bodyUsername,
            passwordHash: passwordHash,
        },
    });
    if (!user) {
        return res.status(404).json({ message: "User cannot be created" });
    }
    //this creates the user information and token
    const userInformation = (0, auth_utils_1.createUnsecuredUserInformation)(user);
    const token = (0, auth_utils_1.createTokenForUser)(user);
    // return res.status(200).json({ userInformation})
    return res.status(200).json({ token, userInformation });
}));
//# sourceMappingURL=authRouter.router.js.map