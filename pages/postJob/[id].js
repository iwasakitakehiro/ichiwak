import { useForm } from "react-hook-form";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
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

export default function RegisterForm() {
  const [Message, setMessage] = useState(null);
  const router = useRouter();

  function validateFileSize(value) {
    if (value && value[0]) {
      const fileSize = value[0].size; // ファイルのサイズを取得（bytes単位）
      const maxSize = 1 * 1024 * 1024; // 1MBをbytes単位で定義
      return fileSize <= maxSize || "1MB以上の画像は許可されていません。";
    }
    return true;
  }

  const formFields = [
    {
      label: "求人名",
      name: "title",
      placeholder: "タイトル",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
    },
    {
      label: "求人詳細",
      name: "description",
      required: true,
      requiredMessage: "",
      component: "Textarea",
      placeholder: `週休2日制（休日は土日祝日）
      年間有給休暇10日～20日（下限日数は、入社半年経過後の付与日数となります）
      年間休日日数124日■土曜、日曜、祝日（社内カレンダーによる）
      ■夏期休暇（5日程度）、年末年始休暇（8日程度）、その他`,
      type: "text",
    },
    {
      label: "職種",
      name: "industry",
      required: true,
      requiredMessage: "必須項目です",
      component: "Select",
      options: [
        { value: "", label: "選択してください" },
        { value: "Service", label: "サービス業" },
        { value: "Construction", label: "建設業" },
        { value: "hairSalon", label: "美容室" },
        { value: "Restaurant", label: "飲食業" },
        { value: "Childcare", label: "保育業" },
      ],
      type: "select",
    },
    {
      label: "アイキャッチ画像",
      name: "imageUrl",
      required: false,
      requiredMessage: "",
      component: "Input",
      type: "file",
      validate: validateFileSize,
    },
    {
      label: "雇用形態",
      name: "type",
      required: true,
      requiredMessage: "必須項目です",
      component: "Select",
      options: [
        { value: "", label: "選択してください" },
        { value: "FullTime", label: "正社員" },
        { value: "Contract", label: "契約社員" },
        { value: "PartTime", label: "アルバイト" },
      ],
      type: "select",
    },
    {
      label: "地域",
      name: "region",
      required: true,
      requiredMessage: "必須項目です",
      component: "Select",
      options: [
        { value: "", label: "選択してください" },
        { value: "Ichihara", label: "市原" },
        { value: "Chiharadai", label: "ちはら台" },
        { value: "Goi", label: "五井" },
        { value: "Tatsumidai", label: "辰巳台" },
        { value: "Kokubunjidai", label: "国分寺台" },
        { value: "Anesaki", label: "姉崎" },
        { value: "Shizu", label: "市津" },
        { value: "Sanwa", label: "三和" },
        { value: "Yusyu", label: "有秋" },
        { value: "Nansou", label: "南総" },
        { value: "Kamo", label: "加茂" },
      ],
      type: "select",
    },
    {
      label: "勤務地",
      name: "location",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      placeholder: "千葉県市原市市原1-1-1",
      type: "text",
    },
    {
      label: "勤務地詳細",
      name: "location_detail",
      required: false,
      requiredMessage: "",
      component: "Textarea",
      placeholder: `勤務地最寄駅：内房線／八幡宿駅
      受動喫煙対策：屋内全面禁煙＜勤務地補足＞
      マイカー通勤可（無料駐車場あり）＜転勤＞`,
      type: "text",
    },
    {
      label: "勤務時間開始",
      name: "start_time",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "time",
    },
    {
      label: "勤務時間終了",
      name: "finish_time",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "time",
    },
    {
      label: "勤務時間詳細",
      name: "working_hours_detail",
      required: false,
      requiredMessage: "",
      component: "Textarea",
      placeholder: `7:30～17:00 （所定労働時間：8時間0分）
      休憩時間：90分
      時間外労働有無：無`,
      type: "text",
    },
    {
      label: "給与",
      name: "salary",
      required: true,
      requiredMessage: "必須項目です",
      component: "Input",
      placeholder: "500　(最低年収を数字だけ記入)",
      type: "number",
    },
    {
      label: "給与詳細",
      name: "salary_detail",
      required: false,
      requiredMessage: "必須項目です",
      component: "Textarea",
      type: "text",
    },
    {
      label: "福利厚生",
      name: "welfare",
      required: true,
      requiredMessage: "",
      component: "Textarea",
      type: "text",
    },
    {
      label: "休日・休暇",
      name: "vacation",
      required: true,
      requiredMessage: "",
      component: "Textarea",
      placeholder: `週休2日制（休日は土日祝日）
      年間有給休暇10日～20日（下限日数は、入社半年経過後の付与日数となります）
      年間休日日数124日■土曜、日曜、祝日（社内カレンダーによる）
      ■夏期休暇（5日程度）、年末年始休暇（8日程度）、その他`,
      type: "text",
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
    try {
      const url = data.imageUrl[0] ? await uploadPhoto(data.imageUrl) : null;
      data.imageUrl = url;
      const response = await fetch("/api/postJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setMessage(result.message);
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
            id="companyId"
            value={router.query.id}
            type="hidden"
            {...register("companyId", {
              required: "必須項目です",
            })}
          />
        </FormControl>
        {formFields.map((field) => {
          let Component;
          if (field.component === "Textarea") {
            Component = Textarea;
          } else if (field.component === "Select") {
            Component = Select;
          } else {
            Component = Input;
          }
          return (
            <FormControl
              key={field.name}
              mb={5}
              isRequired={field.required}
              isInvalid={Boolean(errors[field.name])}
            >
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <FormErrorMessage>
                {errors[field.name] && errors[field.name].message}
              </FormErrorMessage>
              {field.component !== "Select" ? (
                <Component
                  id={field.name}
                  placeholder={field.placeholder}
                  type={field.type} // 追加された部分
                  {...register(field.name, {
                    required: field.required ? field.requiredMessage : false,
                    validate: field.validate,
                  })}
                />
              ) : (
                <Component
                  id={field.name}
                  {...register(field.name, {
                    required: field.required ? field.requiredMessage : false,
                  })}
                >
                  {field.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Component>
              )}
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
