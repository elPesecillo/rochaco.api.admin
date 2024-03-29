const express = require("express");

const router = express.Router();
const proxy = require("express-http-proxy");
const { rewriteURL } = require("./helpers");
const auth = require("../middleware/auth");

// routes
const apiRoutes = require("./apiRoutes");

router.use("/api/*", auth.checkApiAuth);
router.all("/api/*", apiRoutes);

router.use("/apiPayments/*", auth.checkApiAuth);
router.use(
  "/apiPayments/*",
  proxy(process.env.API_PAYMENTS_URL, {
    proxyReqPathResolver(req) {
      const redirectTo = rewriteURL(
        req.protocol,
        req.get("Host"),
        req.baseUrl,
        req.query
      );
      // eslint-disable-next-line no-console
      console.log("redirect to", redirectTo);
      return redirectTo;
    },
  })
);

module.exports = router;
