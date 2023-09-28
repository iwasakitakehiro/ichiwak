import NextLink from "next/link";
import { useSession } from "next-auth/react";

export default function Footer() {
  return (
    <>
      <footer className="bg-green-500 py-20 mt-56">
        <nav className="text-white w-2/3 m-auto flex flex-wrap sm:gap-10 gap-7">
          <NextLink className="hover:border-b" href="/">
            トップページ
          </NextLink>
          <NextLink className="hover:border-b" href="/">
            仕事を探す
          </NextLink>
          <NextLink className="hover:border-b" href="/about">
            いちワクとは
          </NextLink>
          <NextLink className="hover:border-b" href="/privacy">
            プライバシーポリシー
          </NextLink>
          <NextLink className="hover:border-b" href="/">
            お問い合わせ
          </NextLink>
          <NextLink className="hover:border-b" href="/auth/login">
            ログイン
          </NextLink>
        </nav>
      </footer>
    </>
  );
}
