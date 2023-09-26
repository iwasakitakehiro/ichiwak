import { prisma } from "@/lib/prisma";

class JobService {
  async fetchJobs(page) {
    const limit = 20; // 1ページあたりのレコード数
    const skip = (page - 1) * limit; // スキップするレコード数

    return prisma.job.findMany({
      skip: skip, // ページネーションのためのスキップ
      take: limit, // 1ページあたりのレコード数
      include: {
        company: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }
}

export default (req, res) => {
  const page = Number(req.query.page) || 1; // クエリからページ番号を取得
  const jobService = new JobService();

  return jobService
    .fetchJobs(page)
    .then((jobs) => {
      res.status(200).json(jobs);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
