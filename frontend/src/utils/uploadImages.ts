import axios from "axios";
export async function uploadImage(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageFile);

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
