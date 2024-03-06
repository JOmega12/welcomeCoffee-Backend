import express = require('express');
import { coffeeRouter } from '../router/coffeeRouter.router.';
import { userRouter } from '../router/userRouter.router';
import { authController } from '../router/authRouter.router';
import { User } from '@prisma/client';
import cors = require('cors');
import { favoriteRouter } from '../router/favRouter.router';

const app = express();
app.use(cors());
// uses the type system for authMid
declare global {
    namespace Express {
        interface Request {
            user? : User;
        }
    }

    namespace NodeJS {
        export interface ProcessEnv {
          HOST: string;
          DATABASE_URL: string;
          JWT_SECRET: string;
        }
      }
}

app.use(express.json());
app.use(authController);
app.use("/coffee", coffeeRouter);
// app.use("/coffee", createProxyMiddleware({target: 'http://localhost:4000', changeOrigin: true}) ,coffeeRouter);
app.use("/users", userRouter); 
app.use("/favorites", favoriteRouter);



// this launches the port 4000
app.listen(4000);


// there is an import bcrypt problem with no defauly export whenever i run npx tsc ./src/server.ts
// for typescript node