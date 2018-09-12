import assert from 'assert';
import { install } from 'lolex';
import resolveWhen from '.';

describe('resolveWhen', function () {
  let clock;
  before(function () { clock = install() });
  after(function () { clock.uninstall() });

  describe('.defaults.interval', function () {
    it('should set to 50 (ms)', function () {
      assert.equal(resolveWhen.defaults.interval, 50);
    });
    it('should be immutable', function () {
      try {
        resolveWhen.defaults.interval = 100;
      } catch (e) {
        assert(e.message.includes("Cannot assign to read only property 'interval' of object"));
      }
    });
  });

  describe('when called with no arguments', function () {
    let promise;
    beforeEach(function () {
      promise = resolveWhen();
    });
    it('should resolve', function () {
      return promise;
    });
  });

  describe('when called with condition that eventually becomes true', function () {
    let condition = false;
    let promise;
    beforeEach(function () {
      promise = resolveWhen(() => condition);
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
          resolveWhen(() => false),
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
        promise = resolveWhen(() => false, { max });
      });
      it('should not reject before max * interval', function () {
        const timeLimit = resolveWhen.defaults.interval * (max - 1);
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
        clock.tick(resolveWhen.defaults.interval * max);
        return promise
          .then(() => { throw Error('Promise should not have resolved') })
          .catch((error) => {
            assert.equal(error.message, `Maximum iterations (${max}) exceeded`);
          });
      });
    });
  });
});
