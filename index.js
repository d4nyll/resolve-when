function promiseUntil(condition = () => true, interval = 50, max) {
  return new Promise((resolve, reject) => {
    (function poll(iteration = 1) {
      if (condition()) return resolve();
      if (iteration === max) return reject();
      setTimeout(poll, interval, ++iteration);
    })();
  });
}

export default promiseUntil;
