export function classifyMedia(file) {
  const mime = file.type || "";
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (mime.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(extension)) return "image";
  if (mime.startsWith("audio/") || ["mp3", "wav", "m4a", "aac", "flac", "ogg"].includes(extension)) return "audio";
  if (mime.startsWith("video/") || ["mp4", "mov", "m4v", "webm", "mkv"].includes(extension)) return "video";
  return "file";
}
