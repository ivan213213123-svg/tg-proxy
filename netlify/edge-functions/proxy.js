export default async (request) => {
  const url = new URL(request.url);
  const target = "https://api.telegram.org" + url.pathname + url.search;
  let body;
  if (!["GET", "HEAD"].includes(request.method)) {
    body = await request.arrayBuffer();
  }
  const init = {
    method: request.method,
    headers: request.headers,
    body,
  };
  return fetch(target, init);
};

export const config = { path: "/*" };
