const axios = require("axios");
const { handleError, handleResponse } = require("./ApiUtils");

const httpRequest = (method, url, request, _headers) => {
  let hdrs = { ..._headers };
  return axios({
    method,
    url,
    data: request,
    headers: hdrs,
  })
    .then((res) => {
      const result = handleResponse(res);
      return Promise.resolve(result);
    })
    .catch((err) => {
      //throw handleError(err);
      return Promise.reject(handleError(err));
    });
};

const get = (url, request, headers) => {
  let queryString = "";
  if (request && Object.keys(request).length > 0) {
    queryString += "?";
    let len = Object.keys(request).length,
      cnt = 0;
    for (let key in request) {
      cnt++;
      queryString += `${key}=${request[key].toString()}`;
      if (len > cnt) queryString += "&";
    }
  }
  return httpRequest("get", `${url}${queryString}`, null, headers);
};

const deleteRequest = (url, request, headers) => {
  return httpRequest("delete", url, request, headers);
};

const post = (url, request, headers) => {
  return httpRequest("post", url, request, headers);
};

const put = (url, request, headers) => {
  return httpRequest("put", url, request, headers);
};

const patch = (url, request, headers) => {
  return httpRequest("patch", url, request, headers);
};

const postForm = async (url, formData, headers) => {
  try {
    let hdrs = {
      ...headers,
      "Content-Type": "multipart/form-data",
    };
    let res = await axios.post(url, formData, { headers: hdrs });
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
