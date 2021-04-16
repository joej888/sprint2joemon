const config = require("config");
const { Sentry } = require("vod-npm-sentry");
const sentryCategory = config.get("sentry.categories.getPlanDetails");
const contractService = require("vod-npm-services/vod-ms-account-summary");
const client = require("restify-prom-bundle").client;
const getPlanDetailError = new client.Counter({
  name: "counter_get_plan_detail_error",
  help: "vod-ms-account-summary getPlanDetails map call error",
});

exports.handler = async function getPlanDetails(req, res, next) {
  Sentry.info("Beginning getPlanDetails...", {}, sentryCategory);
  const params = {
    headers: req.headers,
    msisdn: req.params.msisdn,
  };
  const response = await contractService.getPlanDetails(req, params);
  let output = "";
  if (response.ok == false) {
    output = {
      code: response.error.status,
      status: response.error.name,
      message: "Invalid Msisdn"
    };
    getPlanDetailError.inc();
    res.status(output.code);
    res.json(output);
    return next(response.error);
  } else {
    const planList = {
      agreementItem: [
        {
          product: [
            {
              id: response.data.result.planCode,
              name: response.data.result.plan,
            }
          ],
          termOrCondition: [
            {
              id: response.data.result.planCode,
              validFor: {
                endDateTime: response.data.result.endDate,
                startDateTime: response.data.result.startDate,
              },
            }
          ],
        }
      ],
      characteristic: [
        {
          name: "upgradeDue",
          value: response.data.result.upgradeDue
        },
        {
          name: "redirectLink",
          value: response.data.result.banner.redirectLink
        },
        {
          name: "imageLink",
          value: response.data.result.banner.imageLink
        },
        {
          name: "processing",
          value: response.data.result.processing
        },
        {
          name: "successful",
          value: response.data.successful
        },
        {
          name: "code",
          value: response.data.code
        }
      ],
    };

    res.status(response.status);
    res.json(planList);
    return next();
  }
};