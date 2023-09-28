import CardCompornent from "@/components/card";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setData(data);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const toggle = () => {
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
            gap="2.5rem"
            flexWrap="wrap"
          >
            <Box mb={4} w="40">
              <FormLabel htmlFor="employment-type">雇用形態</FormLabel>
              <Select
                id="employment-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  雇用形態
                </option>
                <option value="FullTime">正社員</option>
                <option value="PartTime">アルバイト</option>
                <option value="Contract">派遣</option>
              </Select>
            </Box>
            <Box mb={4} w="40">
              <FormLabel htmlFor="region">地域</FormLabel>
              <Select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="" disabled>
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
            <Box mb={4} w="40">
              <FormLabel htmlFor="job-type">職種</FormLabel>
              <Select
                id="job-type"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="" disabled>
                  職種
                </option>
                <option value="Service">サービス業</option>
                <option value="Construction">建設業</option>
                <option value="hairSalon">美容室</option>
                <option value="Restaurant">飲食業</option>
                <option value="Childcare">保育士</option>
              </Select>
            </Box>
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
              onClick={toggle}
            >
              {isSubmitting ? <p>検索中...</p> : <p>検索</p>}
            </Button>
          </Box>
        </FormControl>
      </div>

      <div className="my-20">
        <CardCompornent job={jobdata}></CardCompornent>
      </div>
    </>
  );
};

export default List;
