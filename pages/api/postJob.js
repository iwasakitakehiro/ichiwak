import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        companyId,
        imageUrl,
        industry,
        title,
        description,
        region,
        location,
        salary,
        type,
        location_detail,
        working_hours_detail,
        start_time,
        finish_time,
        salary_detail,
        welfare,
        vacation,
      } = req.body;
      const newJob = await prisma.job.create({
        data: {
          title: title,
          type: type,
          industry: industry,
          location_detail: location_detail,
          start_time: start_time,
          imageUrl: imageUrl,
          finish_time: finish_time,
          salary_detail: salary_detail,
          description: description,
          working_hours_detail: working_hours_detail,
          welfare: welfare,
          location: location,
          region: region,
          vacation: vacation,
          salary: salary,
          company: {
            connect: {
              id: Number(companyId), // 既存の会社を接続する場合
            },
          },
        },
      });
      return res.status(201).json({ message: "求人情報を公開しました" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
  res.status(405).end(); // Method Not Allowed
}
