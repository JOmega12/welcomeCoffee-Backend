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
exports.coffeeRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const zod_express_middleware_1 = require("zod-express-middleware");
const auth_utils_1 = require("../auth.utils");
const prisma = new client_1.PrismaClient();
const coffeeRouter = (0, express_1.Router)();
exports.coffeeRouter = coffeeRouter;
const coffeeSchema = zod_1.z.object({
    title: zod_1.z.string({
        errorMap: (_err) => ({ message: "Title needs to be a string" }),
    }),
    instructions: zod_1.z.string({
        errorMap: (_err) => ({ message: "Description needs to be a string" }),
    }),
    image: zod_1.z.string({
        errorMap: (_err) => ({ message: "Image needs to be a string" }),
    }),
});
// INDEX
// This allows to view ALL the coffee
// the middleware validateRequest does the strict typing instead of having to write if statements if the variable is the typeof string
coffeeRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coffee = yield prisma.coffee.findMany({});
    res.send(coffee);
}));
// SHOW ENDPOINT
// specific number of the id
coffeeRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const coffee = yield prisma.coffee.findUnique({
        where: {
            id,
        },
    });
    // shows if the item is there using the id
    if (!coffee) {
        return res.status(204).send("No Content");
    }
    res.send(coffee);
}));
// DELETE ENDPOINT
coffeeRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const deletedCoffee = yield Promise.resolve()
        .then(() => {
        return prisma.coffee.delete({
            where: {
                id,
            },
        });
    })
        .catch(() => null);
    if (deletedCoffee === null) {
        res.status(404).send({ error: "Coffee not found!" });
    }
    return res.status(200).send("Coffee Deleted!");
}));
// POST REQUEST AKA CREATING A COFFEE
coffeeRouter.post("/", (0, zod_express_middleware_1.validateRequest)({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        instructions: zod_1.z.string(),
        image: zod_1.z.string(),
    }),
}), auth_utils_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCoffee = yield prisma.coffee.create({
            data: Object.assign({}, req.body),
        });
        res.status(201).send(newCoffee);
    }
    catch (e) {
        console.error(e);
        res.status(500);
    }
}));
// PATCH REQUEST AKA UPDATING COFFEE
coffeeRouter.patch("/:id", (0, zod_express_middleware_1.validateRequest)({
    body: coffeeSchema.partial(),
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const { title, image, instructions } = req.body || {};
    const validKeys = ["title", "instructions", "image"];
    const errors = [];
    const invalidKeys = Object.keys(req.body).filter((item) => {
        return !validKeys.includes(item);
    });
    if (invalidKeys.length > 0) {
        for (const key of invalidKeys) {
            errors.push(`${key} is not a valid key`);
        }
    }
    if (errors.length > 0) {
        res.status(400).send({ error: "Error 400 Invalid Keys" });
    }
    try {
        const existingCoffee = yield prisma.coffee.findUnique({
            where: {
                id: id,
            },
        });
        if (!existingCoffee) {
            return res.status(404).send({ error: "Coffee not found" });
        }
        const updateCoffee = yield prisma.coffee.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                image: image,
                instructions: instructions,
            },
        });
        res.status(201).send(updateCoffee);
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ error: "error 500 Internal Server" });
    }
}));
//# sourceMappingURL=coffeeRouter.router..js.map