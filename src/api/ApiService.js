const axios = require("axios");
const { handleError, handleResponse } = require("./ApiUtils");

const httpRequest = (method, url, request, _headers) => {
  const hdrs = { ..._headers };
  return axios({
    method,
    url,
    data: request,
    headers: hdrs,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  })
    .then((res) => {
      const result = handleResponse(res);
      return Promise.resolve(result);
    })
    .catch((err) =>
      // throw handleError(err);
      Promise.reject(handleError(err))
    );
};

const get = (url, request, headers) => {
  let queryString = "";
  if (request && Object.keys(request).length > 0) {
    queryString += "?";
    const len = Object.keys(request).length;
    let cnt = 0;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in request) {
      cnt += 1;
      queryString += `${key}=${request[key].toString()}`;
      if (len > cnt) queryString += "&";
    }
  }
  return httpRequest("get", `${url}${queryString}`, null, headers);
};

const deleteRequest = (url, request, headers) =>
  httpRequest("delete", url, request, headers);

const post = (url, request, headers) =>
  httpRequest("post", url, request, headers);

const put = (url, request, headers) =>
  httpRequest("put", url, request, headers);

const patch = (url, request, headers) =>
  httpRequest("patch", url, request, headers);

const postForm = async (url, formData, headers) => {
  try {
    const hdrs = {
      ...headers,
      "Content-Type": "multipart/form-data",
    };
    const res = await axios.post(url, formData, { headers: hdrs });
    return handleResponse(res);
  } catch (err) {
    return handleError(err);
  }
};

module.exports = {
  get,
  delete: deleteRequest,
  post,
  postForm,
  put,
  patch,
};
