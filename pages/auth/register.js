import { useState } from "react";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState(null);
  const [Message, setMessage] = useState(null);

  function isValidPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  }

  const onSubmit = async (formData) => {
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
    <div className="relative">
      {Message && (
        <div className="w-1/2 mx-auto absolute left-0 right-0 text-center">
          <Box
            mx="auto"
            rounded="md"
            bg="green.500"
            color="white"
            fontSize="sm"
            fontWeight="bold"
            px="4"
            py="3"
            role="alert"
          >
            {Message}
          </Box>
        </div>
      )}
      <Box mx="auto" maxW="screen-xl" px="4" py="16" mt="20">
        <Box mx="auto" maxW="lg">
          <Box
            as="h1"
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            mb="6"
          >
            ユーザー登録
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="role" mb="4" hidden>
              <FormLabel>属性</FormLabel>
              <Select {...register("role", { required: "属性は必須です。" })}>
                <option value="JobSeeker">求職者</option>
              </Select>
              {errors.role && (
                <FormErrorMessage>{errors.role.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="name" mb="4" isInvalid={!!errors.name}>
              <FormLabel>氏名</FormLabel>
              <Input
                {...register("name", { required: "氏名は必須です。" })}
                placeholder="氏名"
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="email" mb="4" isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email", {
                  required: "メールアドレスは必須です。",
                })}
                placeholder="メールアドレス"
              />
              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="password" mb="4" isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                {...register("password", {
                  required: "パスワードは必須です。",
                })}
                placeholder="パスワード"
                type="password"
              />
              {errors.password && (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              )}
            </FormControl>

            <Box textAlign="center" mb="4">
              {errorMessage && <Box color="red.600">{errorMessage}</Box>}
            </Box>

            <Button
              mt={4}
              colorScheme="green"
              isLoading={isSubmitting}
              type="submit"
              w="full"
            >
              登録
            </Button>
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
