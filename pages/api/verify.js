import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const verify = await prisma.verificationToken.findUnique({
      where: {
        token: req.query.token,
      },
    });

    if (!verify) {
      throw new Error("登録できませんでした");
    }
    const password = verify.password;
    const user = await prisma.user.create({
      data: {
        name: verify.name,
        email: verify.identifier,
        emailVerified: new Date(),
        password: password,
        role: verify.role,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        token: req.query.token,
      },
    });

    return res.status(200).json({ message: "登録完了" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
