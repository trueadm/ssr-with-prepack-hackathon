# Hackathon Project: Rendering React to HTML at build time with Prepack

_Note: Prepack is still experimental and not ready for production use_

## Summary

Around two weeks ago, as part of a 2 day hackathon, I wanted to see if it was possible to build on top of our work on [Prepack](https://github.com/facebook/prepack) and ahead-of-time compile a React app, optimized for server-side rendering only. My goal was to see if it was possible to eliminate React completely from the bundle and generate a simple JS file with the minimal logic necessary to render the HTML.

To keep my scope for this hackathon small, I aimed solely to get on getting our existing Hacker News benchmark, written in React, to have 100% the same HTML output the non-compiled version generates.

To build this project, I copy and pasted parts of the current React implementation of ReactDOMServer, modifying the code to work with Prepack's internal object/value model – in particular, with the concept of values being "abstract" and unknown at build time. I used the existing React compiler rendering logic we built in Prepack, and added to it: we already have a “firstRender” mode that strips event handlers and update logic from components; I had Prepack feed that result into my renderer when detecting a "ReactDOMServer.renderToString" method call.

## Results

After around two days, and after adding many TODO comments and invariants into the renderer (implementing the bare minimum needed to get the benchmark working), the output from the compiled version 100% matched that out of the non-compiled version. In this example, **React and ReactDOMServer are completely compiled away** leaving simple HTML strings with holes for the dynamic data. There's no virtual DOM, components, or other React abstractions.

![Rendered output with Prepack](https://raw.githubusercontent.com/trueadm/server-render-hn/master/example.jpg)

- Full benchmark source: https://github.com/facebook/prepack/blob/master/test/react/server-rendering/hacker-news.js
- Compiled output with these optimizations: https://gist.github.com/trueadm/f1692ff635fb666876dcd3f9879a5e1e
- Prepack settings used in this experiment: https://github.com/facebook/prepack/blob/master/scripts/debug-fb-www.js#L53-L81

All of this was made possible by the progress we've made with Prepack and how much it's capable of handling now. We still have a lot of work to go and this experimental ReactDOMServer renderer in Prepack is by no means usable (it's full of TODOs and hasn't been tested on anything other than this benchmark!). 

## Performance

Even though I made zero attempt on optimizing the output, I thought I'd run a bunch of benchmarks on the output using NodeJS to see how well the compiled output performed compared to the non-compiled output. The results are pretty shocking, but please note that this is a tiny benchmark so these results are not necessarily representative of real-world apps. Please also note, in this benchmark we're measuring the time to emit the HTML string via Node – not the time to render it to the browser/client. The compiled version does not take in the JSON data source at compile time, all the JSON is processed at runtime like in a normal app.

- HN benchmark with ReactDOMServer 16.4: **13.093ms**
- HN benchmark compiled with Prepack master as of today: **0.245ms** (not a typo)

(Node 8.9.4 for both, best of 4 runs, excluding startup costs on a MacBook Pro 2017 model)

## Summary

The project is purely an experiment to see what is possible with Prepack. Given the results and the relatively short time it took to put this experiment together it really does show the power of Prepack as a platform. Putting this all together without Prepack would have been virtually impossible, let alone in the space of a hackathon project. The Prepack and React teams are still working closely together on correctness for Prepack and general compilation efforts but there's definitely a lot of potential here.

## Setup guide

If you'd like to run the benchmark or play with Prepack locally, here's how you can set it up:

- Checkout [Prepack](https://github.com/facebook/prepack) locally
- `yarn build` in the root of the Prepack directory
- Create an empty JS file at `${PREPACK_ROOT}/fb-www/input.js`
- Open the `debug-fb-www` [script](https://github.com/facebook/prepack/blob/master/scripts/debug-fb-www.js#L77) and change this line so the value is `true` 
- Copy the [source](https://github.com/facebook/prepack/blob/master/test/react/server-rendering/hacker-news.js) and put it into `input.js`
- Run the command `yarn debug-fb-www`. This is a script that will run Prepack with the React options enabled on `input.js`
- The compiled output will be in `output.js`

This is all experimental and not for prodcution use, so expect bugs and things not working.
