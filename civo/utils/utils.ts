import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?type=${type}&message=${encodeURIComponent(message)}`);
}


export function formatToKSTWithTime(isoString: string): string {
  const date = new Date(isoString);

  // UTC 기준에서 KST (+9시간)로 변환
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  const hours = String(kstDate.getHours()).padStart(2, '0');
  const minutes = String(kstDate.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export function formatToKST(isoString: string): string {
  const date = new Date(isoString);

  // UTC 기준에서 KST (+9시간)로 변환
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}