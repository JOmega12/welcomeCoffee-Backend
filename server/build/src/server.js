"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const coffeeRouter_router_1 = require("../router/coffeeRouter.router.");
const userRouter_router_1 = require("../router/userRouter.router");
const authRouter_router_1 = require("../router/authRouter.router");
const cors = require("cors");
const favRouter_router_1 = require("../router/favRouter.router");
const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouter_router_1.authController);
app.use("/coffee", coffeeRouter_router_1.coffeeRouter);
// app.use("/coffee", createProxyMiddleware({target: 'http://localhost:4000', changeOrigin: true}) ,coffeeRouter);
app.use("/users", userRouter_router_1.userRouter);
app.use("/favorites", favRouter_router_1.favoriteRouter);
// this launches the port 4000
app.listen(4000);
// there is an import bcrypt problem with no defauly export whenever i run npx tsc ./src/server.ts
// for typescript node
//# sourceMappingURL=server.js.map