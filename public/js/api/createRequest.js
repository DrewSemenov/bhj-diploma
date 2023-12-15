/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = async (options = {}) => {
  const sendData = {
    url: options.url,
    method: options.method,
    body: null,
    responseType: 'json',
  };

  const arrayFromData = Object.entries(options.data);

  if (options.method === 'GET') {
    sendData.url += arrayFromData
      .reduce((acc, [key, value]) => acc + `${key}=${value}&`, '?')
      .slice(0, -1);
  }

  if (options.method === 'POST') {
    sendData.body = new FormData();
    arrayFromData.forEach(([key, value]) => sendData.body.append(key, value));
  }

  const sendRequest = async ({ url, method, body, responseType }) =>
    fetch(url, {
      method,
      body,
      responseType,
    });

  const response = await sendRequest(sendData);
  console.log(
    '🚀 ~ file: createRequest.js:34 ~ createRequest ~ response:',
    response
  );
};

