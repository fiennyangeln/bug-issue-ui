import { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Projects from './views/Projects';
import Bugs from './views/Bugs';

class App extends Component {
  cache = new InMemoryCache();
  apolloClient = new ApolloClient({
    cache: this.cache,
    link: new HttpLink({
      uri: 'https://api.github.com/graphql',
      headers: {
        authorization: 'Bearer 9737563b0606fb06c580dc205c69d6bbbb9a24e1',
      },
    }),
  });
  render() {
    return (
      <ApolloProvider client={this.apolloClient}>
        <BrowserRouter>
          <Switch>
            <Route path="/projects" component={Projects} />
            <Route path="/bugs" component={Bugs} />
            <Redirect from="/" to="/projects" />
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
