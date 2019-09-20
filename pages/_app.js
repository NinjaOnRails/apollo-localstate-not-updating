import App from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import withApollo from '../withApolloClient';

class MyApp extends App {
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
