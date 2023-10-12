import { useRouter } from "next/router";
import List from ".";

export const getServerSideProps = async (context) => {
  // ページ番号が指定されていない場合は1として解釈
  const page = context.params.page ? parseInt(context.params.page) : 1;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getJobList?page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      props: { data: data.data, total: data.total, limit: data.limit, page },
    };
  } catch (error) {
    console.error("Error fetching job list:", error);
    return { notFound: true };
  }
};

const DiscoverPage = ({ data, total, limit, page }) => {
  const router = useRouter();

  const totalPages = Math.ceil(total / limit);
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <>
      <List data={data} />
      <div className="pagination flex justify-center space-x-4 mt-5">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => router.push(`/discover${p === 1 ? "" : `/${p}`}`)} // 1ページ目は/discover、それ以降は/discover/2, /discover/3という形式になります。
            className={`w-9 h-9 rounded-full text-sm ${
              page == p
                ? "bg-green-400 text-white"
                : "bg-white border border-green-400 text-green-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </>
  );
};
export default DiscoverPage;
