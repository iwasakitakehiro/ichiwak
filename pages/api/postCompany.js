import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { recruiterId, name, contactEmail, description, logo, website } =
        req.body;

      const newCompany = await prisma.company.create({
        data: {
          recruiterId: Number(recruiterId),
          name: name,
          description: description,
          logo: logo,
          contactEmail: contactEmail,
          website: website,
        },
      });

      return res.status(200).json({ message: "会社情報を登録しました" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  res.status(405).end(); // Method Not Allowed
}
