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
const client_1 = require("@prisma/client");
const auth_utils_1 = require("../auth.utils");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // ... you will write your Prisma Client queries here
        yield prisma.favorite.deleteMany();
        yield prisma.coffee.deleteMany();
        yield prisma.user.deleteMany();
        const testUsername = yield prisma.user.create({
            data: {
                username: 'tester',
                passwordHash: yield (0, auth_utils_1.encryptPassword)('testPass'),
            }
        });
        const jenUser = yield prisma.user.create({
            data: {
                username: 'jen',
                passwordHash: yield (0, auth_utils_1.encryptPassword)('jenHash'),
            }
        });
        const cappucino = yield prisma.coffee.create({
            data: {
                title: 'Cappucino',
                instructions: '1 shot espresso, rest water',
                image: 'https://hips.hearstapps.com/hmg-prod/images/directly-above-shot-of-cappuccino-served-on-table-royalty-free-image-769817517-1564602749.jpg?resize=1200:*',
            }
        });
        const matchaDreamLatte = yield prisma.coffee.create({
            data: {
                title: 'Brown Sugar Matcha Dream ',
                instructions: 'Matcha Latte with a pump of brown sugar',
                image: 'https://christieathome.com/wp-content/uploads/2020/12/Brown-Sugar-Boba-Matcha-Latte-10-460x460.jpg',
            }
        });
        const brownSugarOatmilk = yield prisma.coffee.create({
            data: {
                title: 'Mix coffee with Oatmilk',
                instructions: 'Mix 2 espresso shots with Oatmilk',
                image: 'https://perfectdailygrind.com/wp-content/uploads/2016/11/latte-art-@harshlight-1024x683.jpg',
            }
        });
        const VsColdBrew = yield prisma.coffee.create({
            data: {
                title: 'Vanilla Creme Cold Brew ',
                instructions: 'Coffee that is brewed overnight with vanilla creme"',
                image: 'https://coffeeaffection.com/wp-content/uploads/2021/05/Spanish-latte-milk-and-espresso.jpg',
            }
        });
        const testFavoriteOne = yield prisma.favorite.create({
            data: {
                userId: testUsername.id,
                coffeeId: matchaDreamLatte.id
            },
        });
        const testFavoriteTwo = yield prisma.favorite.create({
            data: {
                userId: testUsername.id,
                coffeeId: brownSugarOatmilk.id
            },
        });
        const jenFavoriteOne = yield prisma.favorite.create({
            data: {
                userId: jenUser.id,
                coffeeId: brownSugarOatmilk.id
            },
        });
    });
}
main()
    .then(() => {
    console.log('seeded');
}).catch(() => {
    console.log('Something went wrong');
});
// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
//# sourceMappingURL=seed.js.map