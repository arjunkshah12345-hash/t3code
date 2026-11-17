export const GITHUB_REPOSITORY_URL = "https://github.com/arjunkshah12345-hash/tung-tung-tung-code";

export function sitePath(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
