import 'chai/register-should';
import chai from 'chai';
import config from 'config';
import httpStatus from 'http-status-codes';
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as UpgradeService from 'vod-npm-services/vod-ms-upgrades/service';

chai.use(sinonChai);
const expect = chai.expect;
const assert = sinon.assert;

// Controllers
import { handler as controller } from '../../src/controllers/getUpgradeEligible';

// Mocks
import {
  success,
  failure,
  expected
} from '../mocks/getUpgradeEligibleMocks';

let serviceStub, logger, req, res, next;

describe('Get Upgrade Eligibility controller', function () {

  before(() => {
    serviceStub = sinon.stub(UpgradeService, 'getUpgradeEligible');
    logger = require('vod-npm-console-logger').createLogger({
      name: 'vod-ms-upgrade-product-catalogue',
      level: config.get('log.level')
    });
  });

  beforeEach(() => {
    next = sinon.spy();
    serviceStub.reset();

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.log = logger;
  });

  after(() => {
    serviceStub.restore();
  });

  afterEach(() => {
    req = null;
    res = null;
    next = null;
  });

  it('returns expected response when ok is true', async () => {
    req.params = {
      msisdn: "0829999999"
    };
    const expectedParams = {
      headers: req.headers,
      msisdn: req.params.msisdn
    };

    serviceStub
      .withArgs(req, expectedParams)
      .resolves(success.mock);

    await controller(req, res, next);

    expect(res._getStatusCode()).to.equal(httpStatus.OK);

    const response = JSON.parse(res._getData());

    expect(response).to.deep.equal(expected.data);
  });

  it('invokes error middleware correctly when ok is false', async () => {
    req.params = {
      msisdn: "0829999999"
    };

    const expectedParams = {
      headers: req.headers,
      msisdn: req.params.msisdn
    };

    serviceStub
      .withArgs(req, expectedParams)
      .resolves(failure.mock);

    await controller(req, res, next);
    assert.calledOnce(next);
    assert.calledWith(next, failure.mock.error);
  });
});