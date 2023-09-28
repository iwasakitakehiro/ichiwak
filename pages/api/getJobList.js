import { prisma } from "@/lib/prisma";

class JobService {
  async fetchJobs(page, type, region, industry) {
    const limit = 20; // 1ページあたりのレコード数
    const skip = (page - 1) * limit; // スキップするレコード数

    // 基本の検索条件
    const whereConditions = {};
    if (type) {
      whereConditions.type = type;
    }
    if (region) {
      whereConditions.region = region;
    }
    if (industry) {
      whereConditions.industry = industry;
    }

    return prisma.job.findMany({
      skip: skip,
      take: limit,
      include: {
        company: true,
      },
      where: whereConditions,
      orderBy: {
        id: "desc",
      },
    });
  }
}

export default (req, res) => {
  const page = Number(req.query.page) || 1;
  const type = req.query.type;
  const region = req.query.region;
  const industry = req.query.industry;

  const jobService = new JobService();

  return jobService
    .fetchJobs(page, type, region, industry)
    .then((jobs) => {
      res.status(200).json(jobs);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
