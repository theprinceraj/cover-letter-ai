export const cleanMarkdownText = (text: string): string => {
  if (!text) return "";
  return (
    text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/`(.*?)`/g, "$1") // Inline code
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
      // eslint-disable-next-line no-useless-escape
      .replace(/^[\*\-]\s*/, "") // List items
      .replace(/(\s*---)?\s*\**\s*$/, "") // Trailing HRs and asterisks
      .trim()
  );
}; 