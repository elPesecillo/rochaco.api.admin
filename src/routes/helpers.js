const map = {
  "/apiPayments": {
    target: `${process.env.API_PAYMENTS_URL}`,
    pathRewrite: {
      "^.+apiPayments": "",
    },
  },
};

const getMap = (url) => {
  const proxyMap = map;
  const urlParts = url.split("/");
  let foundMap = null;
  for (let i = 0; i <= urlParts.length; i += 1) {
    if (!foundMap) {
      // eslint-disable-next-line prefer-spread
      const innerArray = Array.apply(null, {
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
  const params = { ...queryParams, code: process.env.API_PAYMENTS_KEY };
  Object.keys(params).forEach((p) => {
    queryString = `${queryString}${p}=${params[p]}&`;
  });
  return queryString;
};

exports.rewriteURL = (protocol, host, url, queryParams) => {
  const completeUrl = `${protocol}://${host}${url}`;
  const path = getMap(url);
  if (path) {
    const regex = new RegExp(Object.keys(path.pathRewrite)[0]);
    const replaced = completeUrl.replace(
      regex,
      path.pathRewrite[Object.keys(path.pathRewrite)[0]]
    );
    return Object.keys(queryParams).length > 0
      ? `${path.target}${replaced}${getQueryParams(queryParams)}`
      : `${path.target}${replaced}?code=${process.env.API_PAYMENTS_KEY}`;
  }
  return completeUrl;
};
