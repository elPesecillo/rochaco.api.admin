const map = {
  "/apiPayments": {
    target: `${process.env.API_PAYMENTS_URL}`,
    pathRewrite: {
      "^.+apiPayments": "",
    },
  },
};

const getMap = (url) => {
  let proxyMap = map;
  let urlParts = url.split("/");
  let foundMap = null;
  for (let i = 0; i <= urlParts.length; i++) {
    if (!foundMap) {
      let innerArray = Array.apply(null, {
        length: i + 1,
      }).map(Function.call, Number);
      let uri = "";
      innerArray.forEach((element) => {
        uri += urlParts[element] !== "" ? `/${urlParts[element]}` : "";
      });
      foundMap = proxyMap[uri];
    }
  }
  return foundMap;
};

const getQueryParams = (queryParams) => {
  let queryString = `?`;
  let params = { ...queryParams, code: process.env.API_PAYMENTS_KEY };
  Object.keys(params).forEach((p) => {
    queryString = `${queryString}${p}=${params[p]}&`;
  });
  return queryString;
};

exports.rewriteURL = (protocol, host, url, queryParams) => {
  let completeUrl = `${protocol}://${host}${url}`;
  let path = getMap(url);
  if (path) {
    let regex = new RegExp(Object.keys(path.pathRewrite)[0]);
    var replaced = completeUrl.replace(
      regex,
      path.pathRewrite[Object.keys(path.pathRewrite)[0]]
    );
    return Object.keys(queryParams).length > 0
      ? `${path.target}${replaced}${getQueryParams(queryParams)}`
      : `${path.target}${replaced}?code=${process.env.API_PAYMENTS_KEY}`;
  } else return completeUrl;
};
