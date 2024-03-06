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
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_utils_1 = require("../auth.utils");
const prisma = new client_1.PrismaClient();
const favoriteRouter = (0, express_1.Router)();
exports.favoriteRouter = favoriteRouter;
// this is to view ALL favorites
favoriteRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const favorites = yield prisma.favorite.findMany({});
    res.send(favorites);
}));
// this creates the favorite
favoriteRouter.post("/", auth_utils_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const [, token] = ((_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, " ")) || [];
        const myJWTData = (0, auth_utils_1.getDataFromAuthToken)(token);
        const usernameFromJWTData = myJWTData === null || myJWTData === void 0 ? void 0 : myJWTData.username;
        const user = yield prisma.user.findFirst({
            where: {
                username: usernameFromJWTData,
            },
        });
        const { coffeeId } = req.body;
        // Check if the user is found
        if (!user) {
            return res.status(401).json({ message: "User not Found" });
        }
        if (!user.id) {
            return res.status(401).json({ message: "User Id Not Found" });
        }
        if (!coffeeId) {
            return res.status(401).json({ message: "Coffee Id Not Found" });
        }
        const newFavoriteCoffee = yield prisma.favorite.create({
            data: {
                userId: user.id,
                coffeeId,
            },
        });
        if (!newFavoriteCoffee) {
            res.status(404).send({ error: "Favorite not favorited" });
        }
        res.status(201).json(newFavoriteCoffee);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
// this is to delete Favorites
favoriteRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    try {
        const checkExistingFavorite = yield prisma.favorite.findUnique({
            where: {
                id,
            },
        });
        if (!checkExistingFavorite) {
            return res.status(404).json({ message: "Cannot find favorite" });
        }
        const deletedCoffee = yield prisma.favorite.delete({
            where: {
                id,
            },
        });
        res.status(204).send(deletedCoffee);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
//# sourceMappingURL=favRouter.router.js.map