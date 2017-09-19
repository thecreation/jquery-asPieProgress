# [jQuery asPieProgress](https://github.com/amazingSurge/jquery-asPieProgress) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jQuery plugin that animate the pie progress.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asPieProgress.js
├── jquery-asPieProgress.es.js
├── jquery-asPieProgress.min.js
└── css/
    ├── asPieProgress.css
    └── asPieProgress.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asPieProgress/master/dist/jquery-asPieProgress.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asPieProgress/master/dist/jquery-asPieProgress.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asPieProgress --save
```

#### Install From Npm
```sh
npm install jquery-asPieProgress --save
```

#### Install From Yarn
```sh
yarn add jquery-asPieProgress
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asPieProgress.git
cd jquery-asPieProgress
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asPieProgress` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asPieProgress.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asPieProgress.js"></script>
```

#### Required HTML structure

```html
<div class="pieProgress" role="progressbar" data-goal="100" aria-valuemin="0" data-step="2" aria-valuemax="100">
  <div class="progress__meter"><span class="progress__label"></span></div>
</div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asPieProgress({
    namespace: 'pieProgress'
  });
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asPieProgress/tree/master/examples).

## Options
`jquery-asPieProgress` can accept an options object to alter the way it behaves. You can see the default options by call `$.asPieProgress.setDefaults()`. The structure of an options object is as follows:

```
{
  namespace: '',
  classes: {
    svg: 'pie_progress__svg',
    element: 'pie_progress',
    number: 'pie_progress__number',
    content: 'pie_progress__content'
  },
  min: 0,
  max: 100,
  goal: 100,
  size: 160,
  speed: 15, // speed of 1/100
  barcolor: '#ef1e25',
  barsize: '4',
  trackcolor: '#f2f2f2',
  fillcolor: 'none',
  easing: 'ease',
  numberCallback(n) {
    'use strict';
    const percentage = Math.round(this.getPercentage(n));
    return `${percentage}%`;
  },
  contentCallback: null
}
```

## Methods
Methods are called on asPieProgress instances through the asPieProgress method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asPieProgress('start');

// or
var api = $().data('asPieProgress');
api.start();
```

#### start()
Start the pie progress animation.
```javascript
$().asPieProgress('start');
```

#### stop()
Stop the pie progress animation.
```javascript
$().asPieProgress('stop');
```

#### finish()
Finish the pie progress animation. The progress value will update to the goal value immediately.
```javascript
$().asPieProgress('finish');
```

#### reset()
Reset the pie progress. The progress value will reset to first value.
```javascript
$().asPieProgress('reset');
```

#### go(value)
Update the pie progress to the specific value.
```javascript
$().asPieProgress("go", 50);
$().asPieProgress("go", '50%');
```

#### destroy()
Destroy the pie progress instance.
```javascript
$().asPieProgress('destroy');
```

## Events
`jquery-asPieProgress` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asPieProgress::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
start   | Fired when the `start` instance method has been called.
stop    | Fired when the `stop` instance method has been called.
update  | Fires when the progress value is changing. 
finish  | Fires when the animation is finished, Or the `finish` instance method has been called.
reset   | Fired when the `reset` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asPieProgress.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asPieProgress.js"></script>
<script>
  $.asPieProgress.noConflict();
  // Code that uses other plugin's "$().asPieProgress" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asPieProgress` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asPieProgress` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asPieProgress/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asPieProgress.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asPieProgress/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asPieProgress.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asPieProgress
[license]: https://img.shields.io/npm/l/jquery-asPieProgress.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asPieProgress.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asPieProgress