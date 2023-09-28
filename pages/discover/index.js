import CardCompornent from "@/components/card";
import { useState, useEffect } from "react";

export const getServerSideProps = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getJobList`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { props: { data } };
  } catch (error) {
    // エラーログを出力することで、エラーの原因を特定しやすくします。
    console.error("Error fetching job list:", error);
    return { notFound: true };
  }
};

const List = ({ data }) => {
  const [formData, setFormData] = useState({
    type: "",
    region: "",
    industry: "",
  });
  const [jobdata, setData] = useState(null);

  useEffect(() => {
    setData(data);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getData = formData;
    try {
      const queryParams = new URLSearchParams({
        type: getData.type,
        region: getData.region,
        industry: getData.industry,
      }).toString();

      const response = await fetch(`/api/getJobList?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getData),
      });
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <div className="p-6 max-w-4xl w-full mx-auto mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-lg"
        >
          <div className="text-center py-5">
            <p>検索条件</p>
          </div>
          <div className="flex justify-center sm:gap-10 gap-2 flex-wrap">
            <div className="mb-4 w-40">
              <select
                name="type"
                id="employment-type"
                className="p-2 border rounded w-full text-sm"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="" disabled className="none">
                  雇用形態
                </option>
                <option value="FullTime">正社員</option>
                <option value="PartTime">アルバイト</option>
                <option value="Contract">派遣</option>
              </select>
            </div>
            <div className="mb-4 w-40">
              <select
                name="region"
                id="region"
                className="p-2 border rounded w-full text-sm"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="" disabled className="none">
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
              </select>
            </div>
            <div className="mb-4 w-40">
              <select
                name="industry"
                id="job-type"
                className="p-2 border rounded w-full text-sm"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="" disabled className="none">
                  職種
                </option>
                <option value="Service">サービス業</option>
                <option value="Construction">建設業</option>
                <option value="hairSalon">美容室</option>
                <option value="Restaurant">飲食業</option>
                <option value="Childcare">保育士</option>
              </select>
            </div>
          </div>
          <div className="text-center mt-10">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 max-w-xs w-full text-white py-2 px-4 rounded"
            >
              検索
            </button>
          </div>
        </form>
      </div>

      <div className="my-20">
        <CardCompornent job={jobdata}></CardCompornent>
      </div>
    </>
  );
};

export default List;
