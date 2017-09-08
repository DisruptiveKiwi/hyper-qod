exports.decorateTerm = (Term, {
  React,
  notify
}) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
    }

    get(url) {
      // Return a new promise.
      return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
          // This is called even on 404 etc
          // so check the status
          if (req.status == 200) {
            // Resolve the promise with the response text
            resolve(req.response);
          } else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(Error(req.statusText));
          }
        };

        // Handle network errors
        req.onerror = function() {
          reject(Error("Network Error"));
        };

        // Make the request
        req.send();
      });
    }

    pullQuote(res) {
      if (res && res.contents && res.contents.quotes && res.contents.quotes[0].quote) {
        return res.contents.quotes[0].quote;
      }
      return '';
    }

    displayQuote(quote) {
      notify('Quote of the day', quote);
    }

    componentWillMount() {
      this.get('https://quotes.rest/qod')
        .then(JSON.parse)
        .then(this.pullQuote)
        .then(this.displayQuote);
    }

    render() {
      return React.createElement(Term, Object.assign({}, this.props));
    }
  }
}
