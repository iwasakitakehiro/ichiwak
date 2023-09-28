import { useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

type UserExtended = {
  address?: string;
  birthday?: string;
  gender?: string;
  ruby?: string;
  graduation?: string;
  spouse?: string;
  tel?: string;
};

type Data = {
  company: {
    name: string;
  };
  id: number;
  title: string;
  name: string;
  imageUrl: string;
  salary: string;
};

interface ModalProps {
  data: Data;
}

const Modal: React.FC<ModalProps> = ({ data }) => {
  const job = data;
  const { data: session, status, update } = useSession();
  const [Message, setMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const user = session?.user as unknown as UserExtended; // Extended user type

  const toggleModal = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleSubmit = async () => {
    try {
      const responce = await fetch("/api/sendApply", {
        method: "POST",
        body: JSON.stringify({
          job: job,
          user: session?.user,
        }),
      });
      const result = await responce.json();
      setMessage(result.message);
      toggleModal();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage(null);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };
  return (
    <>
      <button
        data-modal-target="popup-modal"
        data-modal-toggle="popup-modal"
        className="block text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        type="button"
        onClick={
          session?.user
            ? toggleModal
            : () => {
                router.push("/auth/login?message=login_required");
              }
        }
      >
        応募する
      </button>
      {Message && (
        <div
          className="fixed top-5 left-0 right-0 w-1/2 mx-auto rounded z-[51] items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
          role="alert"
        >
          <p className="text-sm">{Message}</p>
        </div>
      )}
      {isOpen && (
        <div
          id="defaultModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 m-0 z-50  w-full overflow-x-hidden overflow-y-auto inset-0 max-h-full bg-gray-500 bg-opacity-80"
        >
          <div className="absolute top-0 left-0 right-0 bottom-0 h-fit m-auto md:w-full w-[95%] max-w-2xl max-h-full">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {job.company.name}の求人に応募します
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="defaultModal"
                  onClick={toggleModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  最終確認
                </p>
                {!user.address ||
                !user.birthday ||
                !user.gender ||
                !user.ruby ||
                !user.spouse ||
                !user.tel ? (
                  <div>
                    {!user.address && <p>住所</p>}
                    {!user.birthday && <p>生年月日</p>}
                    {!user.gender && <p>性別</p>}
                    {!user.ruby && <p>フリガナ</p>}
                    {!user.spouse && <p>配偶者</p>}
                    {!user.tel && <p>電話番号</p>}
                    <p>以上が入力されていませんがよろしいですか?</p>
                  </div>
                ) : (
                  <div>
                    <p>登録情報に変更はございませんか？</p>
                  </div>
                )}
                <div>
                  <NextLink className="text-green-500" href="/user">
                    登録情報の変更はこちら
                  </NextLink>
                </div>
              </div>
              {/* <!-- Modal footer --> */}
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="defaultModal"
                  type="button"
                  className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={handleSubmit}
                >
                  応募
                </button>
                <button
                  data-modal-hide="defaultModal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={toggleModal}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
