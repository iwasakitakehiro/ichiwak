import { sendMail } from "@/lib/mailer";

import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const data = JSON.parse(req.body);
    const job = data.job;
    const user = data.user;
    if (user.gender === "male") {
      user.gender = "男性";
    } else if (user.gender === "female") {
      user.gender = "女性";
    }
    if (user.spouse) {
      user.spouse = "あり";
    } else if (!user.spouse) {
      user.spouse = "なし";
    }
    const company = await prisma.company.findUnique({
      where: {
        id: job.companyId,
      },
      include: {
        recruiter: true, // Include the related Company records
      },
    });

    const { method } = req;

    const recruiterMessage = `<p>${job.title}に応募がありました</p>
    <p>■応募者情報</p>
    <p>--------------------------</p>
    <p>■氏名</p>
    <p>${user.name}</p>

    <p>■フリガナ</p>
    <p>${user.ruby}</p>
    
    <p>■Email</p>
    <p>${user.email}</p>
    
    <p>■生年月日</p>
    <p>${user.birthday}</p>
    
    <p>■性別</p>
    <p>${user.gender}</p>
    
    <p>■配偶者</p>
    <p>${user.spouse}</p>
    `;

    const userMessage = `<p>${job.title}にご応募ありがとうございました</p>
    <p>担当者からの連絡をお待ちください</p>
    `;

    switch (method) {
      case "POST": {
        await sendMail(
          `${job.title}に応募がありました`,
          company.recruiter.email,
          recruiterMessage
        );
        await sendMail(
          `${job.title}に応募ご応募ありがとうございました`,
          user.email,
          userMessage
        );
        res.json({ message: "求人に応募しました" });
        break;
      }
      case "GET": {
        //Do some thing
        res.status(200).send(req.auth_data);
        break;
      }
      default:
        res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (err) {
    res.status(400).json({
      error_code: "api_one",
      message: err.message,
    });
  }
}
