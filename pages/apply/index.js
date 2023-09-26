import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  FormLabel,
  FormControl,
  Input,
  Select,
  Button,
  Box,
  FormErrorMessage,
  Textarea,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

export default function RegisterForm(user) {
  const [Message, setMessage] = useState(null);

  const formFields = [
    {
      label: "氏名",
      name: "name",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user.name,
    },
    {
      label: "フリガナ",
      name: "ruby",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: "",
    },
    {
      label: "生年月日",
      name: "birthday",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: "",
    },
    {
      name: "gender",
      label: "性別",
      type: "radio",
      component: "Radio",
      required: true,
      requiredMessage: "性別の選択は必須です",
      options: [
        { value: "male", label: "男性" },
        { value: "female", label: "女性" },
      ],
      defaultValue: "male", // ラジオボタンの初期値
    },
    {
      label: "住所",
      name: "address",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: "",
    },
    {
      label: "電話番号",
      name: "tel",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: "",
    },
    {
      label: "最終学歴",
      name: "graduation",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: "",
    },
    {
      label: "配偶者",
      name: "marid",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: "",
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
    if (data.logo.length == 0) {
      data.logo = null;
    }
    try {
      const response = await fetch("/api/postCompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
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
          let Component;

          if (field.component === "Textarea") {
            Component = Textarea;
          } else if (field.component === "Select") {
            Component = Select;
          } else if (field.component === "Radio") {
            Component = RadioGroup; // ここでラジオボタングループを使用するコンポーネントを選択
          } else {
            Component = Input;
          }

          return (
            <FormControl
              key={index}
              mb={5}
              isRequired={field.required}
              isInvalid={Boolean(errors[field.name])}
            >
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              {field.component === "Radio" ? (
                <Component defaultValue={field.defaultValue}>
                  {field.options &&
                    field.options.map((option, i) => (
                      <Radio key={i} value={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                </Component>
              ) : (
                <Component
                  id={field.name}
                  type={field.type}
                  defaultValue={field.defaultValue}
                  {...register(field.name, {
                    required: field.required ? field.requiredMessage : false,
                  })}
                >
                  {field.options &&
                    field.options.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </Component>
              )}
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
          colorScheme="blue"
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
