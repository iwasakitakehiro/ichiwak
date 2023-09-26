/* eslint-disable react-hooks/rules-of-hooks */
import { getSession, signOut } from "next-auth/react";
import NextLink from "next/link";
import { useSession, signIn } from "next-auth/react";
import CompanyCard from "@/components/companyCard";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import { prisma } from "../../lib/prisma";
import { Userform } from "@/components/userform";

export default function User({ user }) {
  if (!user) {
    return <button onClick={() => signOut()}>Sign out</button>; // or you can return null or some other placeholder
  }
  if (user.role == "Recruiter") {
    return (
      <>
        <div>
          <div>
            <CompanyCard companies={user.companies}></CompanyCard>
          </div>
        </div>
      </>
    );
  }
  if (user.role == "JobSeeker") {
    return (
      <>
        <Userform user={user} />
      </>
    );
  }
  if (user.role == "Admin") {
    return (
      <>
        <div>
          <CompanyCard companies={user.companies}></CompanyCard>
        </div>
        <div>
          <Userform user={user} />
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
      include: {
        companies: {
          include: {
            jobs: true,
          },
        },
      },
    });

    if (user) {
      // UserのDateフィールドを文字列に変換
      user.createdAt = user.createdAt.toISOString();
      user.updatedAt = user.updatedAt.toISOString();
      user.emailVerified = user.emailVerified.toISOString();

      // companiesのDateフィールドを文字列に変換
      user.companies = user.companies.map((company) => {
        // 各companyのjobsのDateフィールドも文字列に変換
        const updatedJobs = company.jobs.map((job) => {
          return {
            ...job,
            createdAt: job.createdAt.toISOString(),
            updatedAt: job.updatedAt.toISOString(),
          };
        });

        return {
          ...company,
          jobs: updatedJobs, // 更新されたjobsをcompanyに再代入
          createdAt: company.createdAt.toISOString(),
          updatedAt: company.updatedAt.toISOString(),
        };
      });
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: { user },
  };
}
