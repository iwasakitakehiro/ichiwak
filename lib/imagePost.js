import { getUniqueStr } from "@/lib/getUniqueStr";
export const uploadPhoto = async (e) => {
  const file = e[0];
  console.log(file);
  if (!file) {
    return null;
  }
  const filename = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);
  const token = getUniqueStr();
  const res = await fetch(
    `/api/upload-url?file=${token}${filename}&fileType=${fileType}`
  );

  const { url, fields } = await res.json();
  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (upload.ok) {
    const imageUrl = `https://${fields.bucket}.s3.amazonaws.com/${fields.key}`;
    return imageUrl;
  } else {
    console.error("Upload failed.");
    return null;
  }
};
