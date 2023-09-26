import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import NextLink from "next/link";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [Message, setMessage] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (router.query.message === "login_required") {
      console.log(router.query.message);
      setMessage("ログインしてください");
      // 3秒後にメッセージを消す
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (router.query.message === "register_complete") {
      setMessage("登録が完了しました ログインを開始してください");
      // 3秒後にメッセージを消す
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result) {
        setMessage("ログインしました");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMessage(null);
        router.push("/discover");
      }
    } else {
      const data = await response.json();
      setErrorMessage(data.error);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 mt-20">
        {Message && (
          <div
            className="fixed top-5 left-0 right-0 w-1/2 mx-auto rounded z-[51] items-center bg-green-500 text-white text-sm font-bold px-4 py-3"
            role="alert"
          >
            <p className="text-sm">{Message}</p>
          </div>
        )}
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold  sm:text-3xl">
            ログイン
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <div className="text-center text-lg font-medium">
              {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="メールアドレス"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="パスワード"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white"
            >
              ログイン
            </button>

            <p className="text-center text-sm text-gray-500">
              アカウント
              <NextLink
                href="/auth/register"
                className="underline"
                aria-current="page"
              >
                登録はこちら
              </NextLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
