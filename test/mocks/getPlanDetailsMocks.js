const success = {
  mock: {
    ok: true,
    status: 200,
    data: {
      result: {
        plan: "Smart Data 1GB",
        upgradeDue: "07 February 2021",
        startDate: "07 July 2019",
        endDate: "07 July 2021",
        banner: {
          redirectLink: "/cloud/upgrades/upgrade-check",
          imageLink: "summary/images/upgrade-now.jpg",
        },
        planCode: null,
        processing: false,
      },
      successful: false,
      code: 0,
    },
  },
};

const expected = {
  data: {
    agreementItem: [
      {
        product: [
          {
            id: null,
            name: "Smart Data 1GB",
          },
        ],
        termOrCondition: [
          {
            id: null,
            validFor: {
              endDateTime: "07 July 2021",
              startDateTime: "07 July 2019",
            },
          },
        ],
      },
    ],
    characteristic: [
      {
        name: "upgradeDue",
        value: "07 February 2021",
      },
      {
        name: "redirectLink",
        value: "/cloud/upgrades/upgrade-check",
      },
      {
        name: "imageLink",
        value: "summary/images/upgrade-now.jpg",
      },
      {
        name: "processing",
        value: false,
      },
      {
        name: "successful",
        value: false,
      },
      {
        name: "code",
        value: 0,
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
