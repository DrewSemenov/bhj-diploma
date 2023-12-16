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

  if (options.data) {
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
  }

  const sendRequest = ({ url, method, body, responseType }) =>
    fetch(url, {
      method,
      body,
      responseType,
    });

  try {
    const response = await sendRequest(sendData);
    const responseData = await response.json();
    options.callback(null, responseData);
  } catch (err) {
    options.callback(err);
  }
};

