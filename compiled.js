(function () {
  var _$O = Array;
  var _$P = _$O.from;
  var fs = require('fs');

  var renderApp = function (data) {
    var _F = function (story, i) {
      var _1C = function (string) {
        if (typeof string === "boolean" || typeof string === "number") {
          return "" + string;
        }

        let str = "" + string;
        let match = matchHtmlRegExp.exec(str);

        if (!match) {
          return str;
        }

        let escape;
        let html = "";
        let index = 0;
        let lastIndex = 0;

        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = "&quot;";
              break;

            case 38:
              escape = "&amp;";
              break;

            case 39:
              escape = "&#x27;";
              break;

            case 60:
              escape = "&lt;";
              break;

            case 62:
              escape = "&gt;";
              break;

            default:
              continue;
          }

          if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
          }

          lastIndex = index + 1;
          html += escape;
        }

        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      };

      var _$4 = i + 1;

      var _$5 = story.id;

      var _$6 = "" + _$5;

      var _$7 = story.title;
      var _$8 = story.url;

      if (_$8) {
        var _$9 = story.url;

        var _$A = _$9 + "";

        var _$B = _$A.replace("https://", "");

        var _$C = _$B.replace("http://", "");

        var _$D = _$C.split("/");

        var _$E = _$D["0"];
      }

      var _$F = story.score;

      var _$G = _$F + " points";

      var _$H = story.by;
      var _$I = story.time;

      var _$J = 2274825600 - _$I;

      var _$K = story.descendants;
      var _$L = story.descendants;

      var _$M = (_$K || 0) + " comments";

      var _y = _$J / 60;

      return `<tr class="athing"><td style="vertical-align:top;text-align:right" class="title"><span class="rank">${_1C(_$4 + ".")}</span></td><td class="votelinks" style="vertical-align:top"><center><a href="#"><div class="votearrow" titl="upvote"></div></a></center></td><td class="title"><a href="#" class="storylink">${_1C(_$7)}</a>${_$8 ? `<span class="sitebit comhead"> (<a href="#">${_1C(_$E)}</a>)</span>` : ""}</td></tr><tr><td colSpan="2"></td><td class="subtext"><span class="score">${_1C(_$G)}</span> by <a href="#" class="hnuser">${_1C(_$H)}</a> <span class="age"><a href="#">${_y < 60 ? _1C(Math.round(_y) + " minutes ago") : _1C(Math.round(_y / 60) + " hours ago")}</a></span> | <a href="#">hide</a> | <a href="#">${_1C(_$M)}</a></td></tr><tr style="height:5px" class="spacer"></tr>`;
    };

    var _C = function (array) {
      let length = array.length;
      let i = 0;
      let str = "";
      let item;

      while (i < length) {
        item = array[i++];

        if (previousWasTextNode === true) {
          str += "<!-- -->" + item;
        } else {
          str += item;
        }

        previousWasTextNode = item[0] !== "<";
      }

      return str;
    };

    var matchHtmlRegExp = /["'&<>]/;
    var previousWasTextNode = false;
    var _$0 = data.length;

    var _$1 = _$0 > 0;

    if (_$1) {
      var _$2 = _$P(data);

      var _$3 = _$2.map(_F);
    }

    return `<center data-reactroot=""><table id="hnmain" border="0" cellPadding="0" cellSpacing="0" width="85%" style="background-color:#f6f6ef"><tbody>${_$1 ? `<tr style="background-color:#222"><table style="padding:4px" width="100%" cellSpacing="0" cellPadding="0"><tbody><tr><td style="width:18px;padding-right:4px"><a href="#"><img src="logo.png" width="16" height="16" style="border:1px solid #00d8ff"/></a></td><td style="line-height:12pt" height="10"><span class="pagetop"><b class="hnname">React HN Benchmark</b><a href="#">new</a> | <a href="#">comments</a> | <a href="#">show</a> | <a href="#">ask</a> | <a href="#">jobs</a> | <a href="#">submit</a></span></td></tr></tbody></table></tr><tr height="10"></tr><tr><td><table cellPadding="0" cellSpacing="0" class="itemlist"><tbody>${_C(_$3)}</tbody></table></td></tr>` : ""}</tbody></table></center>`;
  };

  function getJSON() {
    let data = fs.readFileSync("hacker-news.json").toString();
    return data;
  }

  const data = JSON.parse(getJSON("hacker-news.json"));

  renderApp(data);

  console.time("Hacker News benchmark")
  for (let i = 0; i < 1; i++) {
    renderApp(data);
  }
  console.timeEnd("Hacker News benchmark")

  module.exports = renderApp;
})();