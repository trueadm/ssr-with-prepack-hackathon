# React Hacker News benchmark with experimental React compiler (Prepack)

## Summary

This was an experiment to see the performance of React + ReactDOMServer using `renderToString` vs Prepack's React compiler on the same sourcecode. 
In this benchmark we're measuring the time to emit the HTML string via Node. The compiled version does not take in the data source, instead that is
supplied at runtime.

Using the Hacker News benchmark sourcecode located in the Prepack repo:
https://github.com/facebook/prepack/blob/master/test/react/server-rendering/hacker-news.js

Hacker News JSON data:
https://github.com/facebook/prepack/blob/master/test/react/server-rendering/hacker-news.json

Prepack settings used in this experiment:
https://github.com/facebook/prepack/blob/master/scripts/debug-fb-www.js#L53-L81

## Setup guide

To get compile the sourcecode locally:
- Checkout [Prepack](https://github.com/facebook/prepack) locally
- `yarn build` in the root of the Prepack directory
- Create an empty JS file at `${PREPACK_ROOT}/fb-www/input.js`
- Open the `debug-fb-www` [script](https://github.com/facebook/prepack/blob/master/scripts/debug-fb-www.js#L77) and change this line so the value is `true` 
- Copy the [source](https://github.com/facebook/prepack/blob/master/test/react/server-rendering/hacker-news.js) and put it into `input.js`
- Run the command `yarn debug-fb-www`. This is a script that will run Prepack with the React options enabled on `input.js`
- The compiled output will be in `output.js`

This is all experimental and not for prodcution use.

## Results:

The [rendered output](https://gist.github.com/trueadm/f1692ff635fb666876dcd3f9879a5e1e) looks like this:



- HN benchmark with ReactDOMServer 16.4: **13.093ms**
- HN benchmark compiled with Prepack master as of today: **0.245ms** (not a typo)

(Node 8.9.4 for both, best of 4 runs, excluding startup costs on a MacBook Pro 2017 model)
