import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import store from './store';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>
    </ErrorBoundary>
  </Provider>
);
