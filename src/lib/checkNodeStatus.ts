export const checkNodeStatus = async (url: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-cache",
    })
      .then(() => {
        clearTimeout(timeoutId);
        return true;
      })
      .catch(() => {
        clearTimeout(timeoutId);
        return false;
      });

    return response;
  } catch {
    return false;
  }
};
