/**
 * Parses a page range string (e.g., "1-3, 5, 8-10") into an array of unique, sorted page numbers.
 * 
 * @param rangeString The input string to parse.
 * @param totalPages The total number of pages in the document (used for validation).
 * @returns Array of unique page numbers (1-indexed).
 * @throws Error if the range is invalid.
 */
export function parsePageRange(rangeString: string, totalPages: number): number[] {
  if (!rangeString || rangeString.trim() === "") {
    return [];
  }

  // Remove all whitespace
  const cleanString = rangeString.replace(/\s+/g, "");
  
  // Basic validation for invalid characters
  if (!/^[\d,-]+$/.test(cleanString)) {
    throw new Error("Invalid characters in range. Only numbers, commas, and hyphens are allowed.");
  }

  const parts = cleanString.split(",").filter((p) => p !== "");
  const pages = new Set<number>();

  for (const part of parts) {
    if (part.includes("-")) {
      const bounds = part.split("-");
      if (bounds.length !== 2) {
        throw new Error(`Invalid range format: ${part}`);
      }
      
      const start = parseInt(bounds[0], 10);
      const end = parseInt(bounds[1], 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid numbers in range: ${part}`);
      }
      if (start <= 0 || end <= 0) {
        throw new Error("Page numbers must be greater than 0.");
      }
      if (start > totalPages || end > totalPages) {
        throw new Error(`Page numbers cannot exceed total pages (${totalPages}).`);
      }
      if (start > end) {
        throw new Error(`Invalid range: ${part}. Start page must be less than or equal to end page.`);
      }

      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        throw new Error(`Invalid page number: ${part}`);
      }
      if (page <= 0) {
        throw new Error("Page number must be greater than 0.");
      }
      if (page > totalPages) {
        throw new Error(`Page ${page} exceeds total pages (${totalPages}).`);
      }
      
      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
