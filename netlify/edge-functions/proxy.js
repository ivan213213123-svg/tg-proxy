export default async (request) => {
  const url = new URL(request.url);
  const target = "https://api.telegram.org" + url.pathname + url.search;
  const init = {
    method: request.method,
    headers: request.headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    duplex: "half",
  };
  return fetch(target, init);
};

export const config = { path: "/*" };
