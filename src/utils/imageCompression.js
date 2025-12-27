import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  return await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  });
};
