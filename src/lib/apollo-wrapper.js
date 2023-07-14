'use client';

import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    SuspenseCache
} from '@apollo/client';
import {
    ApolloNextAppProvider,
    NextSSRInMemoryCache,
    NextSSRApolloClient,
    SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr';

function makeClient() {
    const httpLink = new HttpLink({
        // https://studio.apollographql.com/public/spacex-l4uc6p/
        uri: 'https://main--spacex-l4uc6p.apollographos.net/graphql'
    });

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === 'undefined'
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true
                      }),
                      httpLink
                  ])
                : httpLink
    });
}

function makeSuspenseCache() {
    return new SuspenseCache();
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider
            makeClient={makeClient}
            makeSuspenseCache={makeSuspenseCache}>
            {children}
        </ApolloNextAppProvider>
    );
}
