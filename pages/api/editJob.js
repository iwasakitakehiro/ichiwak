import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const {
      jobId,
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

    const updateData = {
      title,
      type,
      industry,
      location_detail,
      start_time,
      finish_time,
      salary_detail,
      description,
      working_hours_detail,
      welfare,
      location,
      region,
      vacation,
      salary,
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await prisma.job.update({
      where: { id: Number(jobId) },
      data: updateData,
    });

    return res.status(201).json({ message: "求人情報を修正しました" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
}
