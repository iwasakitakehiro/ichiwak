import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";

export default function Login() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  const [Message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.message === "login_required") {
      setMessage("ログインしてください");
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (router.query.message === "register_complete") {
      setMessage("登録が完了しました ログインを開始してください");
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  const onSubmit = async (data) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result) {
        setMessage("ログインしました");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMessage(null);
        router.push("/discover");
      }
    } else {
      const responseData = await response.json();
      setErrorMessage(responseData.error);
    }
  };

  return (
    <div className="bg-white max-w-3xl mx-auto sm:my-40 my-28 rounded-2xl w-11/12 sm:py-20 py-10">
      <Box mx="auto" maxW="screen-xl" px="4">
        {Message && (
          <Box
            position="fixed"
            top="5"
            left="0"
            right="0"
            w="1/2"
            mx="auto"
            rounded="md"
            bg="green.500"
            color="white"
            fontSize="sm"
            fontWeight="bold"
            px="4"
            py="3"
            role="alert"
            zIndex={99}
          >
            {Message}
          </Box>
        )}
        <Box mx="auto" maxW="lg">
          <Box
            as="h1"
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            mb="6"
          >
            ログイン
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && (
              <div className="text-center">
                <Box color="red.500" mt={4}>
                  {errorMessage}
                </Box>
              </div>
            )}
            <FormControl isInvalid={errors.email} mb="4">
              <FormLabel htmlFor="email">メールアドレス</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="メールアドレス"
                {...register("email", {
                  required: "メールアドレスを入力してくだい",
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password} mb="4">
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="パスワード"
                {...register("password", {
                  required: "パスワードを入力してください",
                })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              m="50px auto"
              display="block"
              w="150px"
              colorScheme="green"
              isLoading={isSubmitting}
              type="submit"
            >
              送信
            </Button>

            <Box textAlign="center" fontSize="sm" color="gray.500">
              アカウントをお持ちでない場合は
              <NextLink className="border-b" href="/auth/register">
                こちら
              </NextLink>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
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
