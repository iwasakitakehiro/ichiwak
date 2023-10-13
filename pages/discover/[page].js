import { useRouter } from "next/router";
import Cards from "@/components/card";
import { useState, useEffect } from "react";
import { Box, Button, FormControl, Select } from "@chakra-ui/react";

export const getServerSideProps = async (context) => {
  const page = context.params.page ? parseInt(context.params.page) : 1;

  // context.queryから検索条件を取得します。
  const { type, region, industry } = context.query;

  // 検索条件をURLのクエリパラメータとして使用します。
  const queryParams = new URLSearchParams({
    page,
    type: type || "",
    region: region || "",
    industry: industry || "",
  }).toString();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getJobList?${queryParams}`
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
  const [pages, setPages] = useState(
    [...Array(totalPages).keys()].map((i) => i + 1)
  );

  const [formData, setFormData] = useState({
    type: "",
    region: "",
    industry: "",
  });
  const [jobdata, setData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const toggle = () => {
    setIsSubmitting(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 空の値を持つクエリパラメータを除外する関数
    const filterEmptyParams = (params) => {
      const result = {};
      for (const key in params) {
        if (params[key] && params[key] !== "") {
          result[key] = params[key];
        }
      }
      return result;
    };

    // 2. フィルタリングされたクエリパラメータのオブジェクトを作成
    const filteredParams = filterEmptyParams(formData);

    // 3. URLSearchParamsを使用してクエリストリングを作成
    const queryParams = new URLSearchParams(filteredParams).toString();

    // 4. 指定された条件をクエリパラメータとしてページにリダイレクト
    router.push(`/discover/1?${queryParams}`);
  };

  const handlePageChange = (p) => {
    const filteredParams = {
      type: router.query.type || "",
      region: router.query.region || "",
      industry: router.query.industry || "",
    };
    const queryParams = new URLSearchParams(filteredParams).toString();
    router.push(`/discover/${p}?${queryParams}`);
  };

  return (
    <>
      <div className="p-6 max-w-4xl w-full mx-auto mt-20">
        <FormControl
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={4}
          borderRadius="md"
          shadow="lg"
        >
          <div className="text-center my-5">
            <p>条件検索</p>
          </div>
          <Box
            display="flex"
            justifyContent="center"
            gap="2rem"
            flexWrap="wrap"
          >
            <div>
              <Box w="40">
                <Select
                  id="employment-type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option className="text-slate-400" value="">
                    雇用形態
                  </option>
                  <option value="FullTime">正社員</option>
                  <option value="PartTime">アルバイト</option>
                  <option value="Contract">派遣</option>
                </Select>
              </Box>
            </div>
            <div>
              <Box w="40">
                <Select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                >
                  <option className="text-slate-400" value="">
                    地域
                  </option>
                  <option value="Ichihara">市原</option>
                  <option value="Chiharadai">ちはら台</option>
                  <option value="Goi">五井</option>
                  <option value="Tatsumidai">辰巳台</option>
                  <option value="Kokubunjidai">国分寺台</option>
                  <option value="Anesaki">姉崎</option>
                  <option value="Shizu">市津</option>
                  <option value="Sanwa">三和</option>
                  <option value="Yusyu">有秋</option>
                  <option value="Nansou">南総</option>
                  <option value="Kamo">加茂</option>
                </Select>
              </Box>
            </div>
            <div>
              <Box w="40">
                <Select
                  id="job-type"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option className="text-slate-400" value="">
                    職種
                  </option>
                  <option value="Sales">営業</option>
                  <option value="Service">サービス業</option>
                  <option value="Construction">建設業</option>
                  <option value="hairSalon">美容室</option>
                  <option value="Restaurant">飲食業</option>
                  <option value="Childcare">保育士</option>
                </Select>
              </Box>
            </div>
          </Box>
          <Box textAlign="center" mt={10}>
            <Button
              type="submit"
              colorScheme="green"
              w="full"
              maxW="xs"
              py={2}
              px={4}
              borderRadius="md"
            >
              <p>検索</p>
            </Button>
          </Box>
        </FormControl>
      </div>
      <div className="my-20">
        <div className="text-center mb-10  text-4xl font-bold">
          <p>求人一覧</p>
        </div>
        <Cards job={jobdata}></Cards>
      </div>
      {/* <div className="pagination flex justify-center space-x-4 mt-5">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-9 h-9 rounded-full text-sm ${
              page == p
                ? "bg-green-400 text-white"
                : "bg-white border border-green-400 text-green-400"
            }`}
          >
            {p}
          </button>
        ))}
      </div> */}
    </>
  );
};
export default DiscoverPage;
