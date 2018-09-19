/**
 * Returns a promise that resolves once condition is met
 *
 * @param {function} condition - Return `true` to cause resolveWhen to resolve
 * @param {Object} options
 * @param {Number} options.max - The maximum number of times that `condition` should run
 * @param {Number} options.interval - Time, in milliseconds, to wait between running `condition`
 */
function resolveWhen(condition = () => true, { max, interval = 50 } = {}) {
  return new Promise((resolve, reject) => {
    (function poll(iteration = 1) {
      if (condition()) return resolve();
      if (iteration === max) return reject(Error(`Maximum iterations (${max}) exceeded`));
      setTimeout(poll, interval, iteration + 1);
    }());
  });
}

Object.defineProperty(resolveWhen, 'defaults', {
  value: Object.create(Object.prototype, {
    interval: { value: 50 },
  }),
});

module.exports = resolveWhen;
