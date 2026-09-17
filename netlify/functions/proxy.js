exports.handler = async (event) => {
  const path = event.path.replace(/^\/.netlify\/functions\/proxy/, '');
  const qs = event.rawQuery ? '?' + event.rawQuery : '';
  const target = 'https://api.telegram.org' + path + qs;

  const headers = { ...event.headers };
  delete headers.host;
  delete headers['content-length'];

  const body = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64')
    : event.body;

  const resp = await fetch(target, {
    method: event.httpMethod,
    headers,
    body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : body,
  });

  const buf = Buffer.from(await resp.arrayBuffer());
  return {
    statusCode: resp.status,
    headers: { 'content-type': resp.headers.get('content-type') || 'application/json' },
    body: buf.toString('base64'),
    isBase64Encoded: true,
  };
};
