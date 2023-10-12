import { useForm } from "react-hook-form";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { uploadPhoto } from "@/lib/imagePost";
import {
  FormLabel,
  FormControl,
  Input,
  Select,
  Button,
  Box,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";

export default function RegisterForm({ user }) {
  const [Message, setMessage] = useState(null);

  const formFields = [
    {
      label: "企業名",
      name: "name",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
    },
    {
      label: "連絡先メール",
      name: "contactEmail",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "email",
    },
    {
      label: "企業PR",
      name: "description",
      required: true,
      requiredMessage: "必須項目です",
      component: "Textarea",
      type: "text",
    },
    {
      label: "企業ロゴ",
      name: "logo",
      required: false,
      requiredMessage: "",
      component: "Input",
      type: "file",
    },
    {
      label: "ウェブサイト",
      name: "website",
      required: false,
      requiredMessage: "",
      component: "Input",
      type: "url",
    },
  ];

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  // フォームが送信されたときの処理
  const onSubmit = handleSubmit(async (data) => {
    const url = data.logo[0] ? await uploadPhoto(data.logo) : null;

    data.logo = url;
    try {
      const response = await fetch("/api/postCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setMessage(result.message);
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  });

  return (
    <Box maxW="800px" w="80%" m="100px auto">
      <form onSubmit={onSubmit}>
        {Message && (
          <div
            className="fixed top-5 left-0 right-0 w-1/2 mx-auto rounded z-50 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
            role="alert"
          >
            <p className="text-sm">{Message}</p>
          </div>
        )}
        <FormControl>
          <Input
            id="recruiterId"
            value={user.id}
            type="hidden"
            {...register("recruiterId", {
              required: "必須項目です",
            })}
          />
        </FormControl>
        {formFields.map((field, index) => {
          const Component =
            field.component === "Textarea"
              ? Textarea
              : field.component === "Select"
              ? Select
              : Input;

          return (
            <FormControl
              key={index}
              mb={5}
              isRequired={field.required}
              isInvalid={Boolean(errors[field.name])}
            >
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <Component
                id={field.name}
                type={field.type}
                {...register(field.name, {
                  required: field.required ? field.requiredMessage : false,
                })}
              />
              {field.options &&
                field.options.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.label}
                  </option>
                ))}
              <FormErrorMessage>
                {errors[field.name] && errors[field.name].message}
              </FormErrorMessage>
            </FormControl>
          );
        })}
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
      </form>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}
