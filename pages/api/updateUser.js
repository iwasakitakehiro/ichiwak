import { prisma } from "@/lib/prisma";

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
        spouse,
        entryDate,
        graduationDate,
        schoolName,
        department,
        degree,
        graduation,
      } = req.body;

      const birthday_date = birthday === "" ? null : new Date(birthday);
      const entry_date = entryDate === "" ? null : new Date(entryDate);
      const graduation_date =
        graduationDate === "" ? null : new Date(graduationDate);

      const thisUser = await prisma.user.findFirst({
        where: {
          email: req.query.email,
        },
        include: {
          academicHistories: true,
        },
      });

      if (thisUser.academicHistories[0]) {
        // 存在する場合は更新
        await prisma.academicHistory.update({
          where: { id: thisUser.id },
          data: {
            entryDate: entry_date,
            graduationDate: graduation_date,
            schoolName: schoolName,
            department: department,
            degree: degree,
            graduation: graduation,
          },
        });
      } else {
        // 存在しない場合は作成
        await prisma.academicHistory.create({
          data: {
            userId: thisUser.id,
            entryDate: entry_date,
            graduationDate: graduation_date,
            schoolName: schoolName,
            department: department,
            degree: degree,
            graduation: graduation,
          },
        });
      }

      const updateUser = await prisma.user.update({
        where: {
          email: req.query.email,
        },
        data: {
          name: name,
          ruby: ruby,
          image: image,
          birthday: birthday_date,
          gender: gender,
          address: address,
          tel: tel,
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
  res.status(405).end();
}
