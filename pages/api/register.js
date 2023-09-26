import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getUniqueStr } from "@/lib/getUniqueStr";
import { sendMail } from "@/lib/mailer";
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { role, name, email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        throw new Error("このメールアドレスは既に使用されています");
      }
      const token = getUniqueStr();
      const hashedPassword = await bcrypt.hash(password, 10);
      const date = new Date();
      const result = await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: token,
          name: name,
          role: role,
          expires: date,
          password: hashedPassword,
        },
      });
      const send = await sendMail(
        `ichiwak登録認証メール`,
        email,
        `
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}&message=register_complete">クリックして登録を完了してください</a>
        `
      );
      return res.status(200).json({
        message: "入力されたメールアドレスに認証メールを送信しました。",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  res.status(405).end(); // Method Not Allowed
}
