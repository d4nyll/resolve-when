# resolve-when

[![Build Status](https://travis-ci.org/d4nyll/resolve-when.svg?branch=master)](https://travis-ci.org/d4nyll/resolve-when)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fd4nyll%2Fresolve-when.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fd4nyll%2Fresolve-when?ref=badge_shield)

Returns a promise that resolves once condition is met

## Installation

`resolve-when` is published at [npmjs.com](https://www.npmjs.com/), and can be installed using [`npm`](https://docs.npmjs.com/cli/npm) or [`yarn`](https://yarnpkg.com/lang/en/).

```bash
$ npm install resolve-when  # npm
$ yarn add resolve-when     # yarn
```

```js
import resolveWhen from 'resolve-when';       // ES6+
const resolveWhen = require('resolve-when');  // ES5
```

## Usage

`resolveWhen` is a function with the following signature:

```
resolveWhen(condition, options)
```

* `condition` _Function_ - a function that will be evaluated to determine when `resolveWhen` should resolve. It is not passed any parameters. Defaults to a function that always resolves to `true`
* `options` _Object_
  * `max` _Integer_ - Maximum number of times that `condition` should be ran. If `max` is undefined, `0`, a negative number, or `Infinity`, it will iterate forever. Defaults to `undefined`
  * `interval` _Integer_ - Number of milliseconds to wait before running `condition` again. Defaults to `50`

### Defaults properties

`resolveWhen.defaults` is a read-only property containing the default `options` object used.

### Return Values

If `condition` returns true, `resolveWhen` will resolve without any value.

If the maximum number of iterations has been reached and `condition` has not returned `true`, `resolveWhen` will reject with ``Error(`Maximum iterations (${max}) exceeded`)``, where `max` is the same as `options.max`

## Contributing

```bash
$ git clone git@github.com:d4nyll/resolve-when.git
$ yarn
$ yarn run test
```

### Tests

Tests are written in [Mocha](https://mochajs.org/) with the [`assert`](https://nodejs.org/api/assert.html) module. We are also using [`lolex`](https://github.com/sinonjs/lolex) as a fake timer to ensure our unit tests run as quick as possible. 

### Code Quality

We have used [`husky`](https://github.com/typicode/husky) to help you ensure:

* Your code is linted
* All tests pass
* Coverage is at 100%

Any PRs which does not pass the linter, tests or coverage tools will be rejected.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fd4nyll%2Fresolve-when.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fd4nyll%2Fresolve-when?ref=badge_large)