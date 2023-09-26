import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        name,
        ruby,
        image,
        birthday,
        gender,
        address,
        tel,
        graduation,
        spouse,
      } = req.body;

      const updateUser = await prisma.user.update({
        where: {
          email: req.query.email,
        },
        data: {
          name: name,
          ruby: ruby,
          image: image,
          birthday: birthday,
          gender: gender,
          address: address,
          tel: tel,
          graduation: graduation,
          spouse: Boolean(spouse),
        },
      });

      return res
        .status(200)
        .json({ message: "ユーザー情報を更新しました", user: updateUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  res.status(405).end(); // Method Not Allowed
}
