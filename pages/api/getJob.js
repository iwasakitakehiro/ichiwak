import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { id } = req.body;

    // IDが不足している場合は400エラーを返す
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const job = await prisma.job.findUnique({
      where: { id: id },
    });

    // jobがnullやundefinedの場合は404エラーを返す
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
