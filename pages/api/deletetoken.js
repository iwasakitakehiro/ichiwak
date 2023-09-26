import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteExpiredTokens() {
  // 現在の日時から15分前の日時を計算
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() - 15);

  // expiresカラムが15分前よりも古いレコードを削除
  await prisma.verificationToken.deleteMany({
    where: {
      expires: {
        lte: expiryDate, // "lte"は"less than or equal to"を意味します。
      },
    },
  });
}

// 関数を呼び出して実行
deleteExpiredTokens()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
