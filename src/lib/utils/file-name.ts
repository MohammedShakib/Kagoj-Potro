export function sanitizeFileName(fileName: string): string {
  // Remove extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  // Replace spaces with hyphens, remove special characters
  return nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
