import NextLink from "next/link";
import { Image } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import gsap from "gsap";
import Status from "./status";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
gsap.registerPlugin(ScrollTrigger);
gsap.config({
  nullTargetWarn: false,
});
export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const targets = document.querySelectorAll(".fade-group");
    targets.forEach((target) => {
      gsap.from(target, {
        opacity: 0,
        duration: 2,
        scrollTrigger: {
          trigger: target,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
    setIsLargeScreen(window.innerWidth >= 1024);
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const menuRef = useRef(null);
  const { data: session } = useSession();
  let imgSrc = session?.user?.image ?? "/images/user-icon.png";
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuOpen && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuOpen]);
  return (
    <header className="fixed top-0 z-[50] w-full ">
      <nav className="bg-white bg-opacity-40 border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl rerative">
          <NextLink href="/" className="flex items-center">
            <Image className="w-52" src="/images/ichiwak-logo.png" />
          </NextLink>
          <div className="flex items-center lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <>
                    <path d="M4 6h16M4 12h16m-7 6h7"></path>
                  </>
                )}
              </svg>
            </button>
          </div>
          {isLargeScreen && (
            <div className="flex items-center lg:order-2">
              <Status />
            </div>
          )}
          {(menuOpen || isLargeScreen) && (
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <NextLink
                    href="/"
                    className="block py-2 pr-4 pl-3 lg:p-0 lg:hover:text-green-500"
                  >
                    トップページ
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/about"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-500 lg:p-0"
                  >
                    いちワクとは
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/discover"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-500 lg:p-0 "
                  >
                    仕事を探す
                  </NextLink>
                </li>
              </ul>
            </div>
          )}
          {menuOpen && (
            <div
              ref={menuRef}
              className="bg-white bg-opacity-40  absolute top-[65px] right-0"
            >
              <div className="mx-auto max-w-screen-xl px-4 lg:px-6 py-2.5">
                <ul
                  className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 text-center"
                  id="btn-wrap"
                >
                  <li>
                    <NextLink
                      href="/"
                      className="block py-5 pr-4 pl-3 lg:p-0 lg:hover:text-green-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      トップページ
                    </NextLink>
                  </li>
                  <li>
                    <NextLink
                      href="/about"
                      className="block py-5 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-500 lg:p-0 "
                      onClick={() => setMenuOpen(false)}
                    >
                      いちワクとは
                    </NextLink>
                  </li>
                  <li>
                    <NextLink
                      href="/discover"
                      className="block py-5 pr-4 pl-3 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-500 lg:p-0 "
                      onClick={() => setMenuOpen(false)}
                    >
                      仕事を探す
                    </NextLink>
                  </li>
                </ul>
                <div className="flex items-center">
                  {session && (
                    <>
                      <NextLink
                        href="/user"
                        className="w-10 h-10 flex justify-center items-center overflow-hidden rounded-full"
                        passHref
                      >
                        <img className="w-full" src={imgSrc} alt="user logo" />
                      </NextLink>
                      <div>
                        <button
                          className=" mx-8 inline-block my-3 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 "
                          onClick={() => signOut()}
                        >
                          ログアウト
                        </button>
                      </div>
                    </>
                  )}
                  {!session && (
                    <>
                      <NextLink
                        href="/auth/login"
                        className="text-gray-800 "
                        onClick={() => setMenuOpen(false)}
                      >
                        ログイン
                      </NextLink>
                      <NextLink
                        href="/auth/register"
                        className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 "
                        onClick={() => setMenuOpen(false)}
                      >
                        登録
                      </NextLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
