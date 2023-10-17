import { prisma } from "@/lib/prisma";

class JobService {
  async fetchJobs(page, type, region, industry) {
    const limit = 20;
    const skip = (page - 1) * limit;

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

    const jobs = await prisma.job.findMany({
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

    const total = await prisma.job.count({
      where: whereConditions,
    });

    const totalPages = Math.ceil(total / limit);

    return { jobs, total, limit, totalPages };
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  let page = Number(req.query.page) || 1;
  page = Math.max(page, 1); // pageが1未満の場合、1として扱います

  const type = req.query.type;
  const region = req.query.region;
  const industry = req.query.industry;

  const jobService = new JobService();

  try {
    const { jobs, total, limit, totalPages } = await jobService.fetchJobs(
      page,
      type,
      region,
      industry
    );
    res.status(200).json({ data: jobs, total, limit, totalPages });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
