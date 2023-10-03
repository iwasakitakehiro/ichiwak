import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
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

export default function EditJob({ job }) {
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
      defaultValue: job.title,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "text",
    },
    {
      label: "求人詳細",
      name: "description",
      required: true,
      defaultValue: job.description,
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
      defaultValue: job.industry,
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
    },
    {
      label: "雇用形態",
      name: "type",
      required: true,
      requiredMessage: "必須項目です",
      defaultValue: job.type,
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
      defaultValue: job.region,
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
      defaultValue: job.location,
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
      defaultValue: job.location_detail,
      placeholder: `勤務地最寄駅：内房線／八幡宿駅
      受動喫煙対策：屋内全面禁煙＜勤務地補足＞
      マイカー通勤可（無料駐車場あり）＜転勤＞`,
      type: "text",
    },
    {
      label: "勤務時間開始",
      name: "start_time",
      required: true,
      defaultValue: job.start_time,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "time",
    },
    {
      label: "勤務時間終了",
      name: "finish_time",
      required: true,
      defaultValue: job.finish_time,
      requiredMessage: "必須項目です",
      component: "Input",
      type: "time",
    },
    {
      label: "勤務時間詳細",
      name: "working_hours_detail",
      required: false,
      requiredMessage: "",
      defaultValue: job.working_hours_detail,
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
      defaultValue: job.salary,
      component: "Input",
      placeholder: "500　(最低年収を数字だけ記入)",
      type: "number",
    },
    {
      label: "給与詳細",
      name: "salary_detail",
      required: false,
      defaultValue: job.salary_detail,
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
      defaultValue: job.welfare,
      type: "text",
    },
    {
      label: "休日・休暇",
      name: "vacation",
      required: true,
      requiredMessage: "",
      component: "Textarea",
      defaultValue: job.vacation,
      placeholder: `週休2日制（休日は土日祝日）
      年間有給休暇10日～20日（下限日数は、入社半年経過後の付与日数となります）
      年間休日日数124日■土曜、日曜、祝日（社内カレンダーによる）
      ■夏期休暇（5日程度）、年末年始休暇（8日程度）、その他`,
      type: "text",
    },
  ];

  const {
    handleSubmit,
    control,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  // フォームが送信されたときの処理
  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = data.imageUrl[0] ? await uploadPhoto(data.imageUrl) : null;
      data.imageUrl = url;
      const response = await fetch("/api/editJob", {
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
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  });

  return (
    <Box maxW="800px" w="80%" m="100px auto">
      <form onSubmit={onSubmit}>
        {Message && (
          <div
            className="fixed top-5 left-0 right-0 w-1/2 mx-auto rounded z-50 items-center bg-green-500 text-white text-sm font-bold px-4 py-3"
            role="alert"
          >
            <p className="text-sm">{Message}</p>
          </div>
        )}
        <FormControl>
          <Input
            id="jobId"
            value={router.query.id}
            type="hidden"
            {...register("jobId", {
              required: "必須項目です",
            })}
          />
        </FormControl>
        {formFields.map((field) => {
          let Component;
          let additionalProps = {};

          if (field.component === "Textarea") {
            Component = Textarea;
          } else if (field.component === "Select") {
            Component = Select;
          } else {
            Component = Input;
            additionalProps.type = field.type;
          }
          if (field.name === "imageUrl") {
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
                <Input
                  id={field.name}
                  type="file"
                  {...register(field.name, {
                    required: field.required ? field.requiredMessage : false,
                    validate: field.validate,
                  })}
                />
              </FormControl>
            );
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
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue}
                  render={({ field }) => (
                    <Component
                      {...field}
                      id={field.name}
                      placeholder={field.placeholder}
                      {...additionalProps}
                    />
                  )}
                />
              ) : (
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={field.defaultValue}
                  render={({ field: renderProps }) => (
                    <Component
                      {...renderProps}
                      id={field.name}
                      {...additionalProps}
                    >
                      {field.options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Component>
                  )}
                />
              )}
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
          修正内容を送信
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
  // URLのパラメータからjobsのidを取得
  const jobId = context.query.id;

  // sessionのユーザーが持っているcompaniesを取得
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      companies: {
        select: {
          jobs: true,
        },
      },
    },
  });

  // ユーザーのcompaniesの中で、指定されたjobIdと一致するjobを探す
  const matchingJobs = user?.companies.flatMap((company) =>
    company.jobs.filter((job) => job.id === parseInt(jobId))
  );

  const job = matchingJobs?.[0];

  if (job) {
    // UserのDateフィールドを文字列に変換
    job.createdAt = job.createdAt.toISOString();
    job.updatedAt = user.updatedAt.toISOString();
  }

  if (!job) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { job },
  };
}
