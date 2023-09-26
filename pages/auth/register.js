import { useState } from "react";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
export default function Login() {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [Message, setMessage] = useState(null);

  function isValidPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword(formData.password)) {
      setErrorMessage(
        "パスワードは8文字以上で英字と数字を組み合わせてください。"
      );
      return;
    }
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      setMessage(result.message);
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
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
            ユーザー登録
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <div className="text-center text-lg font-medium">
              {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            </div>

            <div>
              <label htmlFor="role" className="sr-only">
                属性
              </label>

              <div className="relative">
                <select
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  id="role"
                  value={formData.role}
                  hidden
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                >
                  <option value="JobSeeker">求職者</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="sr-only">
                氏名
              </label>

              <div className="relative">
                <input
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="氏名"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
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
              className="block w-full rounded-lg bg-green-500 px-5 py-3 text-sm font-medium text-white"
            >
              登録
            </button>
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
