import { useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import CardCompornent from "@/components/card";
import NextLink from "next/link";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

export const getServerSideProps = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getJobListAll`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return { props: { data } };
  } catch (error) {
    console.error("Error fetching job list:", error);
    return { notFound: true };
  }
};

function Model() {
  const gltf = useGLTF("/glb/ichihara.glb");
  gltf.scene.position.z = -1;
  gltf.scene.position.y = 0.5;
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      const existingMaterial = child.material;
      const newMaterial = new MeshStandardMaterial({
        map: existingMaterial.map, // 元のテクスチャを保持
        color: existingMaterial.color, // 元の色を保持
        roughness: 0.2,
        metalness: 0.9,
      });
      child.material = newMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  useFrame((state) => {
    gltf.scene.rotation.y += 0.01;
  });
  return <primitive object={gltf.scene} />;
}

export default function Home({ data }) {
  const modelRef = useRef(null);
  const [mainData, setMainData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedData2, setSelectedData2] = useState([]);
  const [pickUpData, setPickUpData] = useState([]);
  const contentRef = useRef(null);
  // 最初のマウント時にデータをフェッチ
  useEffect(() => {
    async function fetchData() {
      const initialData = data.filter((item) => item.region === "Ichihara");
      const initialData2 = data.filter(
        (item) => item.industry === "Construction"
      );
      const pickUp = data.filter((item) => item.picked === true);
      setPickUpData(pickUp);
      setSelectedData(initialData);
      setSelectedData2(initialData2);
      setMainData(data);
    }
    const init = async () => {
      // データのフェッチを待ちます
      await fetchData();
      // スクロールアニメーションの設定
      const lines = document.querySelectorAll(".line");
      let currentLine = 0;
      lines[currentLine].classList.add("active");
      const setActiveLine = (index) => {
        lines.forEach((line) => line.classList.remove("active"));
        lines[index].classList.add("active");
      };
      setActiveLine(currentLine);

      lines.forEach((line, index) => {
        ScrollTrigger.create({
          trigger: line,
          start: "bottom center",
          end: "bottom center",
          onEnter: () => {
            if (index < lines.length - 1) {
              currentLine = index + 1;
              setActiveLine(currentLine);
            }
          },
          onEnterBack: () => {
            if (index > 0) {
              currentLine = index - 1;
              setActiveLine(currentLine);
            }
          },
        });
      });
    };
    init();
  }, []);

  useEffect(() => {
    gsap.to(".mv", { opacity: 1, duration: 1 });
  }, []);

  const videoRef = useRef(null);
  const handleButtonClick = (event) => {
    const regionValue = event.target.value;
    const button = document.querySelector(".region-active");
    button?.classList.remove("region-active");
    event.target.classList.add("region-active");
    const filteredData = mainData.filter((item) => item.region === regionValue);

    // 求人情報のアニメーション
    gsap.to(contentRef.current, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        setSelectedData(filteredData);
        // 新しいデータで再表示
        gsap.to(contentRef.current, {
          duration: 0.5,
          opacity: 1,
        });
      },
    });
  };

  const handleButtonClick2 = (event) => {
    const industryValue = event.target.value;
    const button = document.querySelector(".industry-active");
    button?.classList.remove("industry-active");
    event.target.classList.add("industry-active");
    const filteredData = mainData.filter(
      (item) => item.industry === industryValue
    );

    // 求人情報のアニメーション
    gsap.to(".industry-list", {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        setSelectedData2(filteredData);
        // 新しいデータで再表示
        gsap.to(".industry-list", {
          duration: 0.5,
          opacity: 1,
        });
      },
    });
  };

  const regions = [
    { name: "市原", value: "Ichihara" },
    { name: "ちはら台", value: "Chiharadai" },
    { name: "市津", value: "Shizu" },
    { name: "国分寺台", value: "Kokubunjidai" },
    { name: "五井", value: "Goi" },
    { name: "姉崎", value: "Anesaki" },
    { name: "三和", value: "Sanwa" },
    { name: "有秋", value: "Yusyu" },
    { name: "南総", value: "Nansou" },
    { name: "加茂", value: "Kamo" },
  ];

  const industries = [
    { name: "建設業", value: "Construction" },
    { name: "営業", value: "Sales" },
    { name: "サービス業", value: "Service" },
    { name: "美容院", value: "hairSalon" },
    { name: "飲食業", value: "Restaurant" },
    { name: "保育", value: "Childcare" },
  ];

  return (
    <>
      <section className="mv opacity-0">
        <div className="flex flex-wrap mt-20 justify-center items-start  xl:h-screen relative fade-group">
          <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 md:h-full h-[400px] relative">
            <Canvas className="w-full md:h-full absolute top-0 left-0">
              <ambientLight intensity={10} />
              <spotLight position={[0, 10, 10]} />
              <Model />
            </Canvas>
          </div>
          <div className="inset-0 w-fit h-fit sm:mt-20 mt-5">
            <div className="flex justify-center text-center font-bold sm:text-6xl text-2xl sm:px-40 px-5">
              <p className="sm:leading-[100px] leading-10">
                いちはら
                <br />
                <span className="sm:text-4xl text-lg leading-none block">
                  ×
                </span>
                ワクワク
                <br />
                <span className="sm:text-4xl text-lg leading-none block">
                  ×
                </span>
                WORK
                <br />
              </p>
            </div>
            <h1 className="md:text-8xl text-6xl font-bold text-center">
              <p className="md:text-6xl text-3xl font-bold sm:py-9 py-5">|| </p>
              いちワク
            </h1>
          </div>
        </div>
      </section>
      <section>
        <div className="xl:mt-80 fade-group mt-[300px]">
          <h2 className="text-center font-bold md:text-6xl text-5xl pb-12">
            ABOUT US
          </h2>
        </div>
        <div className="relative">
          <div className="max-w-7xl m-auto md:text-2xl text-[16px] fade-group">
            <div className="content text-right">
              <div className="line xl:text-right text-center">
                当サイトでは、
              </div>
              <div className="line md:pt-14 pt-8 xl:text-right text-center">
                幅広い分野の求人を提供し、
              </div>
              <div className="line md:pt-14 pt-8 xl:text-right text-center">
                市原市での働き方を
                <br className="xl:hidden" />
                全く新しい視点から探求します。
              </div>
              <div className="line md:pt-14 pt-8 xl:text-right text-center">
                どんな夢を抱いていても、
                <br className="xl:hidden" />
                どんなキャリアを目指していても、
              </div>
              <div className="line md:pt-14 pt-8 xl:text-right text-center">
                ここ市原市で
                <br className="xl:hidden" />
                その実現のチャンスを見つけましょう。
              </div>
              <div className="line md:pt-14 pt-8 xl:text-right text-center">
                「いちはらで働こう！」
                <br className="xl:hidden" />
                という一歩を踏み出す勇気、
              </div>
              <div className="line md:pt-14 pt-8 xl:text-right text-center">
                私たちは
                <br className="xl:hidden" />
                あなたと共にその先へ進むお手伝いをします。
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="sm:mt-96 mt-64">
          <h2 className="text-center font-bold sm:pb-56 pb-40 md:text-6xl text-5xl fade-group">
            求人情報
          </h2>
        </div>
        <div className="sm:mb-64 mb-24">
          <h3 className="pb-10 sm:text-2xl text-base text-center font-bold fade-group">
            ピックアップ求人
          </h3>
          <div className="fade-group">
            {pickUpData.map((item) => {
              return (
                <div
                  key={item}
                  className="max-w-3xl w-11/12 mx-auto bg-white sm:py-12 py-6 sm:px-10 px-5 shadow-lg rounded-lg"
                >
                  <div className="sm:mb-10 mb-5 relative">
                    <Box>
                      <video
                        ref={videoRef}
                        src={item.videoUrl}
                        playsInline
                        controls
                        className="object-cover rounded h-full w-full cursor-pointer"
                      />
                    </Box>
                  </div>
                  <div className="p-4 space-y-3">
                    {item.type === "FullTime" && (
                      <p className="text-green-500 inline-block w-20 border border-green-500 text-center py-1 rounded text-xs">
                        正社員
                      </p>
                    )}
                    {item.type === "PartTime" && (
                      <p className="text-orange-500 inline-block w-20 border border-orange-500 text-center py-1 rounded text-xs">
                        アルバイト
                      </p>
                    )}
                    {item.type === "Contract" && (
                      <p className="text-blue-500 inline-block w-20 border border-blue-500 text-center py-1 rounded text-xs">
                        派遣
                      </p>
                    )}
                    <h2 className="text-lg font-semibold">
                      {item.company.name}
                    </h2>
                    <p>
                      {item.title.length > 30
                        ? item.title.slice(0, 30) + "..."
                        : item.title}
                    </p>
                    {item.type === "FullTime" && (
                      <p>年収 : {item.salary}万円~</p>
                    )}
                    {item.type === "PartTime" && <p>時給 : {item.salary}円~</p>}
                    {item.type === "Contract" && <p>時給 : {item.salary}円~</p>}
                    <p>勤務地 : {item.location}</p>
                  </div>
                  <div className="p-4 flex justify-center">
                    <NextLink
                      className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 w-full text-center"
                      href={`/jobs/${item.id}?company=${item.company.name}&title=${item.title}`}
                    >
                      求人詳細
                    </NextLink>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center sm:my-20 my-10">
            <NextLink
              className="sm:text-lg text-sm w-64 text-center bg-green-500 text-white rounded-full py-4 hover:text-green-500 hover:bg-white border border-green-500"
              href="/discover/1"
            >
              求人一覧へ
            </NextLink>
          </div>
        </div>
        <div>
          <h3 className="pb-10 sm:text-2xl text-base text-center font-bold">
            地域から探す
          </h3>
          <div className="text-lg leading-7 flex justify-center max-w-screen-xl mx-auto flex-wrap items-center gap-5 pb-10">
            {regions.map((region) => (
              <button
                key={region.value}
                value={region.value}
                onClick={handleButtonClick}
                className={`region-button w-36 text-sm text-center border border-solid rounded-full py-2 inline-block border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:transition-all ${
                  region.value === "Ichihara" ? "region-active" : ""
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
          <div
            className="min-h-[413px] flex justify-center items-center"
            ref={contentRef}
          >
            {selectedData.length === 0 ? (
              <p>求人情報はまだありません</p>
            ) : (
              <CardCompornent job={selectedData.slice(0, 3)} />
            )}
          </div>
          <div className="flex justify-center sm:my-20 my-10">
            <NextLink
              className="sm:text-lg text-sm w-64 text-center bg-green-500 text-white rounded-full py-4 hover:text-green-500 hover:bg-white border border-green-500"
              href="/discover/1"
            >
              求人一覧へ
            </NextLink>
          </div>
        </div>
        <div className="mt-52">
          <h3 className="pb-10 sm:text-2xl text-base text-center font-bold">
            職種から探す
          </h3>
          <div className="text-lg leading-7 flex justify-center max-w-screen-xl mx-auto flex-wrap items-center gap-5 pb-10">
            {industries.map((industry) => (
              <button
                key={industry.value}
                value={industry.value}
                onClick={handleButtonClick2}
                className={`industry-button w-36 text-sm text-center border border-solid rounded-full py-2 inline-block border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:transition-all ${
                  industry.value === "Construction" ? "industry-active" : ""
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>
          <div className="min-h-[413px] flex justify-center items-center fade-group industry-list">
            {selectedData2.length === 0 ? (
              <p>求人情報はまだありません</p>
            ) : (
              <CardCompornent job={selectedData2.slice(0, 3)} />
            )}
          </div>
          <div className="flex justify-center sm:my-20 my-10">
            <NextLink
              className="sm:text-lg text-sm w-64 text-center bg-green-500 text-white rounded-full py-4 hover:text-green-500 hover:bg-white border border-green-500"
              href="/discover/1"
            >
              求人一覧へ
            </NextLink>
          </div>
        </div>
      </section>
    </>
  );
}
