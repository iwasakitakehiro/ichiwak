import { useState } from "react";
import NextLink from "next/link";

const CompanyCard = ({ companies }) => {
  // アコーディオンの開閉状態を格納する配列
  const [isOpenArray, setIsOpenArray] = useState(companies.map(() => true));

  return (
    <div className="mt-56 container flex flex-col items-center justify-center max-w-4xl  lg:w-full w-[90%] mx-auto bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex flex-wrap w-full px-4 py-5 border-b sm:px-6 bg-gray-100 justify-end">
        <div className="w-full">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            会社情報
          </h3>
          <p className="max-w-2xl mt-1 text-sm text-gray-500 dark:text-gray-200">
            求人を募集する会社を登録してください
          </p>
        </div>
        <div>
          <NextLink
            className="inline-block my-3 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
            href="/company/form"
          >
            会社を追加
          </NextLink>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide w-full">
        {companies.map((item, index) => {
          let imgSrc;
          if (item.logo) {
            imgSrc = item.logo;
          } else {
            imgSrc = "https://flowbite.com/docs/images/logo.svg";
          }

          const dateFromDatabase = item.updatedAt;
          const dateObj = new Date(dateFromDatabase);
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();
          const formattedDate = `${year}年${month}月${day}日`;

          return (
            <div key={index}>
              <li
                className="flex flex-row"
                onClick={() => {
                  let updatedIsOpenArray = [...isOpenArray];
                  updatedIsOpenArray[index] = !updatedIsOpenArray[index];
                  setIsOpenArray(updatedIsOpenArray);
                }}
              >
                <div className="flex flex-wrap items-center flex-1 p-4 cursor-pointer select-none justify-end">
                  <div className="flex flex-col items-center justify-center w-10 h-10 mr-4">
                    <img src={imgSrc} className="w-full" alt="companyLogo" />
                  </div>
                  <div className="flex-1 pl-1 mr-16 ">
                    <div className="font-medium dark:text-white lg:whitespace-normal whitespace-nowrap">
                      {item.name}
                    </div>
                  </div>
                  <NextLink
                    className="mx-5 text-green-500 border border-green-500 bg-white hover:bg-green-500 hover:text-white focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                    href={`/postJob/${item.id}`}
                  >
                    求人を追加
                  </NextLink>
                </div>
              </li>
              <div
                className={`transition-max-height duration-300  ${
                  isOpenArray[index]
                    ? "max-h-[500px]"
                    : "max-h-0 overflow-hidden"
                }`}
              >
                <div className="p-4 bg-gray-100">
                  {item.jobs.map((job, index) => (
                    <div key={index} className="">
                      <NextLink
                        className="w-full inline-block hover:font-bold"
                        href={`/edit/job?id=${job.id}`}
                      >
                        {job.title.length > 20
                          ? job.title.slice(0, 20) + "..."
                          : job.title}
                      </NextLink>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default CompanyCard;
