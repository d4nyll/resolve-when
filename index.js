function promiseUntil(condition = () => true, { max, interval = 50 } = {}) {
  return new Promise((resolve, reject) => {
    (function poll(iteration = 1) {
      if (condition()) return resolve();
      if (iteration === max) return reject(Error(`Maximum iterations (${max}) exceeded`));
      setTimeout(poll, interval, iteration + 1);
    }());
  });
}

Object.defineProperty(promiseUntil, 'defaults', {
  value: Object.create(Object.prototype, {
    interval: { value: 50 },
  }),
});

export default promiseUntil;
