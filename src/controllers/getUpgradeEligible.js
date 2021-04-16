const config = require("config");
const { Sentry } = require("vod-npm-sentry");
const sentryCategory = config.get("sentry.categories.getUpgradeEligible");
const { upgradesService } = require("vod-npm-services");
const client = require("restify-prom-bundle").client;
const getUpgradeEligibleError = new client.Counter({
  name: "counter_get_upgrade_eligibility_check_error",
  help: "vod-ms-upgrades upgradEligibility map call error",
});

exports.handler = async function getUpgradeEligible(req, res, next) {
  Sentry.info("Beginning getUpgradeEligible...", {}, sentryCategory);

  const params = {
    headers: req.headers,
    msisdn: req.params.msisdn,
  };

  const response = await upgradesService.getUpgradeEligible(req, params);
  let output = "";
  if (response.ok == false) {
    output = {
      code: response.error.status,
      status: response.error.name,
      message: "Invalid Msisdn"
    };
    getUpgradeEligibleError.inc();
    res.status(output.code);
    res.json(output);
    return next(response.error);
  } else {
    const eligibilityCheck = {
      productOfferingQualificationDate: response.data.result.upgradeDate,
      qualificationResult: response.data.result.upgradeEligible,
      productOfferingQualificationItem:[
        {
          eligibilityUnavailabilityReason: [
          {
            code: response.data.result.reasonCode,
          }
        ],
        note: [
          {
            text: response.data.result.message
          }
        ],
        product:{
          productCharacteristic:[
            {
              name:"c3dCustomer",
              value: response.data.result.c3dCustomer
            },
            {
              name:"invalidDate",
              value: response.data.result.invalidDate
            },
            {
              name:"business",
              value: response.data.result.business
            },
            {
              name:"upgradeValidNumber",
              value: response.data.result.upgradeValidNumber
            },
            {
              name:"mah",
              value: response.data.result.mah
            },
            {
              name:"upgradeType",
              value: response.data.result.upgradeType
            }
          ]
        }
      }
      ],
      relatedParty:[
        {
          id: response.data.result.msisdn,
          name: response.data.result.userName
        }
      ]
    };
    res.status(response.status);
    res.json(eligibilityCheck);
    return next();
  }
};