import axios from "axios";
import imageCompression from "browser-image-compression";

export async function uploadImage(imageFile: File): Promise<string> {
  const compressedImage = await imageCompression(imageFile, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  });

  const cleanedImage = new File([compressedImage], imageFile.name, {
    type: compressedImage.type,
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
