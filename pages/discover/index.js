import CardCompornent from "@/components/card";

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
  return (
    <div className="my-56">
      <CardCompornent job={data}></CardCompornent>
    </div>
  );
};

export default List;
