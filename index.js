(function () {
  process.env.NODE_ENV = "production";
  const React = require("react");
  const ReactDOMServer = require("react-dom/server");
  const PropTypes = require('prop-types');
  const fs = require('fs');

  function timeAge(time) {
    const now = new Date(2042, 1, 1).getTime() / 1000;
    const minutes = (now - time) / 60;

    if (minutes < 60) {
      return Math.round(minutes) + ' minutes ago';
    }
    return Math.round(minutes / 60) + ' hours ago';
  }

  function getHostUrl(url) {
    return (url + '').replace('https://', '').replace('http://', '').split('/')[0];
  }

  function Story({ story, rank }) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "tr",
        { className: "athing" },
        React.createElement(
          "td",
          {
            style: {
              verticalAlign: 'top',
              textAlign: 'right'
            },
            className: "title" },
          React.createElement(
            "span",
            { className: "rank" },
            rank + '.'
          )
        ),
        React.createElement(
          "td",
          {
            className: "votelinks",
            style: {
              verticalAlign: 'top'
            } },
          React.createElement(
            "center",
            null,
            React.createElement(
              "a",
              { href: "#" },
              React.createElement("div", { className: "votearrow", titl: "upvote" })
            )
          )
        ),
        React.createElement(
          "td",
          { className: "title" },
          React.createElement(
            "a",
            { href: "#", className: "storylink" },
            story.title
          ),
          story.url ? React.createElement(
            "span",
            { className: "sitebit comhead" },
            ' (',
            React.createElement(
              "a",
              { href: "#" },
              getHostUrl(story.url)
            ),
            ")"
          ) : null
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement("td", { colSpan: "2" }),
        React.createElement(
          "td",
          { className: "subtext" },
          React.createElement(
            "span",
            { className: "score" },
            story.score + ' points'
          ),
          ' by ',
          React.createElement(
            "a",
            { href: "#", className: "hnuser" },
            story.by
          ),
          ' ',
          React.createElement(
            "span",
            { className: "age" },
            React.createElement(
              "a",
              { href: "#" },
              timeAge(story.time)
            )
          ),
          ' | ',
          React.createElement(
            "a",
            { href: "#" },
            "hide"
          ),
          ' | ',
          React.createElement(
            "a",
            { href: "#" },
            (story.descendants || 0) + ' comments'
          )
        )
      ),
      React.createElement("tr", {
        style: {
          height: 5
        },
        className: "spacer"
      })
    );
  }

  Story.propTypes = {
    story: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      score: PropTypes.number,
      descendants: PropTypes.number,
      by: PropTypes.string,
      time: PropTypes.number
    }),
    rank: PropTypes.number
  };

  function StoryList({ stories }) {
    return React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        React.createElement(
          "table",
          { cellPadding: "0", cellSpacing: "0", className: "itemlist" },
          React.createElement(
            "tbody",
            null,

            // we use Array.from to tell the compiler that this
            // is definitely an array object
            Array.from(stories).map((story, i) => React.createElement(Story, { story: story, rank: ++i, key: story.id }))
          )
        )
      )
    );
  }

  function HeaderBar(props) {
    return React.createElement(
      "tr",
      { style: { backgroundColor: '#222' } },
      React.createElement(
        "table",
        {
          style: {
            padding: 4
          },
          width: "100%",
          cellSpacing: "0",
          cellPadding: "0" },
        React.createElement(
          "tbody",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { style: { width: 18, paddingRight: 4 } },
              React.createElement(
                "a",
                { href: "#" },
                React.createElement("img", {
                  src: "logo.png",
                  width: "16",
                  height: "16",
                  style: {
                    border: '1px solid #00d8ff'
                  }
                })
              )
            ),
            React.createElement(
              "td",
              { style: { lineHeight: '12pt' }, height: "10" },
              React.createElement(
                "span",
                { className: "pagetop" },
                React.createElement(
                  "b",
                  { className: "hnname" },
                  props.title
                ),
                React.createElement(
                  "a",
                  { href: "#" },
                  "new"
                ),
                ' | ',
                React.createElement(
                  "a",
                  { href: "#" },
                  "comments"
                ),
                ' | ',
                React.createElement(
                  "a",
                  { href: "#" },
                  "show"
                ),
                ' | ',
                React.createElement(
                  "a",
                  { href: "#" },
                  "ask"
                ),
                ' | ',
                React.createElement(
                  "a",
                  { href: "#" },
                  "jobs"
                ),
                ' | ',
                React.createElement(
                  "a",
                  { href: "#" },
                  "submit"
                )
              )
            )
          )
        )
      )
    );
  }

  HeaderBar.defaultProps = {
    title: 'React HN Benchmark'
  };

  class AppBody extends React.Component {
    render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(HeaderBar, null),
        React.createElement("tr", { height: "10" }),
        React.createElement(StoryList, { stories: this.props.stories, limit: this.props.storyLimit })
      );
    }
  }

  AppBody.defaultProps = {
    storyLimit: 10
  };

  function App({ stories }) {
    return React.createElement(
      "center",
      null,
      React.createElement(
        "table",
        {
          id: "hnmain",
          border: "0",
          cellPadding: "0",
          cellSpacing: "0",
          width: "85%",
          style: {
            backgroundColor: '#f6f6ef'
          } },
        React.createElement(
          "tbody",
          null,
          stories.length > 0 ? React.createElement(AppBody, { stories: stories }) : null
        )
      )
    );
  }

  App.propTypes = {
    stories: PropTypes.array.isRequired
  };

  function renderApp(data) {
    return ReactDOMServer.renderToString(React.createElement(App, { stories: data }));
  }

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