import { useSession, getSession, signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
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
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

export const Userform = ({ user }) => {
  const [Message, setMessage] = useState(null);
  const [Gender, setGender] = useState(null);
  const [Spouse, setSpouse] = useState(null);
  const { data: session, status, update } = useSession();

  const formFields = [
    {
      label: "氏名",
      name: "name",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user ? user.name : "",
    },
    {
      label: "フリガナ",
      name: "ruby",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user ? user.ruby : "",
    },
    {
      label: "アイコン用画像",
      name: "image",
      required: false,
      requiredMessage: "",
      component: "Input",
      type: "file",
    },
    {
      label: "生年月日",
      name: "birthday",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user ? user.birthday : "",
    },
    {
      label: "性別",
      name: "gender",
      type: "radio",
      component: "Radio",
      required: false,
      requiredMessage: "性別の選択は必須です",
      options: [
        { value: "male", label: "男性" },
        { value: "female", label: "女性" },
      ],
      defaultValue: user.gender ? user.gender : "",
    },
    {
      label: "住所",
      name: "address",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user ? user.address : "",
    },
    {
      label: "電話番号",
      name: "tel",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user ? user.tel : "",
    },
    {
      label: "最終学歴",
      name: "graduation",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
      defaultValue: user ? user.graduation : "",
    },
    {
      label: "配偶者",
      name: "spouse",
      required: false,
      requiredMessage: "必須項目です",
      component: "Radio",
      type: "text",
      defaultValue: user.spouse ? (user.spouse === true ? "1" : "0") : "",
      options: [
        { value: "1", label: "あり" },
        { value: "0", label: "なし" },
      ],
    },
  ];

  const {
    handleSubmit,
    register,
    getValues,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // フォームが送信されたときの処理
  const onSubmit = handleSubmit(async (data) => {
    try {
      const imageFile = getValues("image").files; // react-hook-formのgetValuesを使用して値を取得
      const url =
        imageFile && imageFile.length > 0
          ? await uploadPhoto(imageFile[0])
          : null;

      data.image = url;
      const response = await fetch(
        `/api/updateUser?name=${data.name}&email=${user.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      setMessage(result.message);
      trigger("session");
      const updatedSession = await getSession();
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  });
  return (
    <>
      <div className="lg:w-1/2 w-[90%] mx-auto">
        <h2 className="text-center mt-20 text-xl font-bold">
          プロフィール編集
        </h2>
        <Box maxW="800px" w="80%" m="75px auto">
          <form onSubmit={onSubmit}>
            {Message && (
              <div
                className="fixed top-5 left-0 right-0 w-1/2 mx-auto rounded z-50 items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
                role="alert"
              >
                <p className="text-sm">{Message}</p>
              </div>
            )}
            {formFields.length > 0 ? (
              formFields.map((field, index) => {
                let Component;
                if (field.component === "Textarea") {
                  Component = Textarea;
                } else if (field.component === "Select") {
                  Component = Select;
                } else if (field.component === "Radio") {
                  Component = RadioGroup;
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
                      field.name === "gender" ? (
                        <Controller
                          name={field.name}
                          control={control}
                          defaultValue={field.defaultValue}
                          render={({ field }) => (
                            <RadioGroup {...field}>
                              <Radio value="male">男性</Radio>
                              <Radio value="female">女性</Radio>
                            </RadioGroup>
                          )}
                        />
                      ) : (
                        <Controller
                          name={field.name}
                          control={control}
                          defaultValue={field.defaultValue}
                          render={({ field }) => (
                            <RadioGroup {...field}>
                              <Radio value="1">あり</Radio>
                              <Radio value="0">なし</Radio>
                            </RadioGroup>
                          )}
                        />
                      )
                    ) : (
                      <Component
                        id={field.name}
                        type={field.type}
                        defaultValue={field.defaultValue}
                        {...register(field.name, {
                          required: field.required
                            ? field.requiredMessage
                            : false,
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
              })
            ) : (
              <p>Loading...</p>
            )}

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
      </div>
    </>
  );
};
