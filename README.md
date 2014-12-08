# jQuery asPieProgress
A jQuery plugin that animate the pie progress.

## Usage

Import this libraries:
* jQuery
* jquery-asPieProgress.js

And CSS:
* progress.css 

Create base html element:
```html
    <div class="pieProgress" role="progressbar" data-goal="100" aria-valuemin="0" data-step="2" aria-valuemax="100">
        <div class="progress__meter"><span class="progress__label"></span></div>
    </div>
```

Initialize progress:
```javascript
$(".progress").asPieProgress({
    namespace: 'pieProgress'
});
```

## Settings

```javascript
{
    namespace: 'asPieProgress',
    min: 0,
    max: 100,
    goal: 100,
    step: 1,
    speed: 50, // refresh speed
    delay: 300,
    easing: 'ease',
    label: function(n) {
        var percentage = this.getPercentage(n);
        return percentage;
    },
    onStart: function(){},
    onStop: function(){},
    onUpdate: function(){},
    onReset: function(){}
}
```

## Public methods

jquery asPieProgress has different methods , we can use it as below :
```javascript
$(".progress").asPieProgress("start");
$(".progress").asPieProgress("stop");
$(".progress").asPieProgress("done");
$(".progress").asPieProgress("go", 50);
$(".progress").asPieProgress("go", '50%');
$(".progress").asPieProgress("reset");
```
## Event

* <code>asPieProgress::start</code>
* <code>asPieProgress::stop</code>
* <code>asPieProgress::done</code>
* <code>asPieProgress::update</code>
* <code>asPieProgress::reset</code>

## Author
[amazingSurge](http://amazingSurge.com)

## Creit
* http://anthonyterrien.com/knob/
* https://github.com/benpickles/peity
* https://github.com/zurb/pizza
* https://github.com/pguso/jquery-plugin-circliful
* http://widgets.better2web.com/loader/
* https://github.com/rendro/easy-pie-chart

## License
jQuery-asPieProgress plugin is released under the <a href="https://github.com/amazingSurge/jquery-asPieProgress/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.