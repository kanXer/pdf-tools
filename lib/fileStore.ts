export let uploadedFiles: File[] = [];

export function setUploadedFiles(files: File[]) {
  uploadedFiles = files;
}

export function getUploadedFiles() {
  return uploadedFiles;
}