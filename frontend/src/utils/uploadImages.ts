import axios from "axios";
export async function uploadImage(imageFile: File): Promise<string> {
  const cleanedFileName = imageFile.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  const cleanedImage = new File([imageFile], cleanedFileName, {
    type: imageFile.type,
  });
  const formData = new FormData();
  formData.append("image", cleanedImage);

  const response = await axios.post("http://localhost:4001/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.data?.url) {
    throw new Error("Image upload failed");
  }

  return response.data.url;
}
