import assert from 'assert';
import { install } from 'lolex';
import promiseUntil from '.';

describe('promiseUntil', function () {
  let clock;
  before(function () { clock = install() });
  after(function () { clock.uninstall() });

  describe('.defaults.interval', function () {
    it('should set to 50 (ms)', function () {
      assert.equal(promiseUntil.defaults.interval, 50);
    });
    it('should be immutable', function () {
      try {
        promiseUntil.defaults.interval = 100;
      } catch (e) {
        assert(e.message.includes("Cannot assign to read only property 'interval' of object"));
      }
    });
  });

  describe('when called with no arguments', function () {
    let promise;
    beforeEach(function () {
      promise = promiseUntil();
    });
    it('should resolve', function () {
      return promise;
    });
  });

  describe('when called with condition that eventually becomes true', function () {
    let condition = false;
    let promise;
    beforeEach(function () {
      promise = promiseUntil(() => condition);
      setTimeout(() => { condition = true }, 10000);
    });
    it('should resolve once condition is met', function () {
      clock.tick(10000);
      return promise;
    });
  });

  describe('when called with condition that always fails', function () {
    const resolvedIndicator = Symbol('resolvedIndicator');
    describe('and no max option', function () {
      const forever = 600000; // Defining 'forever' as 10 minutes
      let promise;
      beforeEach(function () {
        promise = Promise.race([
          promiseUntil(() => false),
          new Promise(resolve => setTimeout(resolve, forever, resolvedIndicator)),
        ]);
      });
      it('should hang forever', function () {
        clock.tick(forever);
        return promise.then((val) => {
          if (val !== resolvedIndicator) {
            throw Error('Promise should not have resolved');
          }
        }, () => {
          throw Error('Promise should not have rejected');
        });
      });
    });
    describe('and max option', function () {
      const max = 30;
      let promise;
      beforeEach(function () {
        promise = promiseUntil(() => false, { max });
      });
      it('should not reject before max * interval', function () {
        const timeLimit = promiseUntil.defaults.interval * (max - 1);
        const testPromise = Promise.race([
          promise,
          new Promise(resolve => setTimeout(resolve, timeLimit, resolvedIndicator)),
        ]);
        clock.tick(timeLimit);
        return testPromise
          .then((val) => {
            if (val !== resolvedIndicator) {
              throw Error('Promise should not have resolved');
            }
          })
          .catch(() => {
            throw Error(`Promise should not have rejected before ${timeLimit}ms`);
          });
      });
      it('should reject after max * interval', function () {
        clock.tick(promiseUntil.defaults.interval * max);
        return promise
          .then(() => { throw Error('Promise should not have resolved') })
          .catch((error) => {
            assert.equal(error.message, `Maximum iterations (${max}) exceeded`);
          });
      });
    });
  });
});
