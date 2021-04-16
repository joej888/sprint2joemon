const success = {
  mock: {
    ok: true,
    status: 200,
    data: {
      result: {
        upgradeEligible: false,
        c3dCustomer: false,
        upgradeDate: null,
        message:
          "There seems to be an issue with the account linked to this number. To resolve this issue, please contact 082 135.",
        msisdn: "0829999999",
        reasonCode: "001",
        userName: null,
        invalidDate: false,
        business: false,
        upgradeValidNumber: false,
        mah: false,
        upgradeType: null,
        links: [Array],
      },
    },
    successful: false,
    code: 0,
  },
};

const expected = {
  data: {
    productOfferingQualificationDate: null,
    qualificationResult: false,
    productOfferingQualificationItem: [
      {
        eligibilityUnavailabilityReason: [
          {
            code: "001",
          },
        ],
        note: [
          {
            text:
              "There seems to be an issue with the account linked to this number. To resolve this issue, please contact 082 135.",
          },
        ],
        product: {
          productCharacteristic: [
            {
              name: "c3dCustomer",
              value: false,
            },
            {
              name: "invalidDate",
              value: false,
            },
            {
              name: "business",
              value: false,
            },
            {
              name: "upgradeValidNumber",
              value: false,
            },
            {
              name: "mah",
              value: false,
            },
            {
              name: "upgradeType",
              value: null,
            },
          ],
        },
      },
    ],
    relatedParty: [
      {
        id: "0829999999",
        name: null,
      },
    ],
  },
};

const failure = {
  mock: {
    ok: false,
    error: {
      response: {
        status : 400,
        name : "CustomErrorr",
      },
    },
  },
  expected: {
    result: {
      code: 404,
      status: "CustomError",
      message: "Invalid Msisdn",
    },
  },
};

module.exports = {
  success,
  failure,
  expected,
};
