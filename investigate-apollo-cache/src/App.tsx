import React, { useState, FC } from 'react';
import { gql } from 'graphql.macro';
import { ApolloConsumer, Query } from 'react-apollo';
// tslint:disable: jsx-no-multiline-js jsx-no-lambda

const DECK_STUB = gql`
query DeckStub {
  rwDeck (id: "cjvch8dx001o50737xvjm0vin") {
    id
    owner {
      id
    }
  }
}
`;
const DECK_STUB_ONE = gql`
query DeckStub {
  rwDeck (id: "cjvch8dx001o50737xvjm0vin") {
    id
  }
}
`;

interface Data {
  rwDeck: { id: string, owner?: { id: string } };
}

// tslint:disable-next-line: variable-name
const App: FC = () => {
  const [hasDehydrated, setHasDehydrated] = useState(false);
  console.log(`hasDehydrated: ${hasDehydrated}`);
  return (
    <div>
      <Query<Data, {}>
        query={DECK_STUB}
        fetchPolicy={hasDehydrated ? 'network-only' : undefined}
      >
        {({ error, data }) => {
          console.log(data);
          if (data && data.rwDeck && !data.rwDeck.owner) {
            setHasDehydrated(true);
          } else {
            setHasDehydrated(false);
          }
          return null;
        }}
      </Query>
      <ApolloConsumer>
        {(client) => {
          return (
            <>
              <button
                onClick={async () => {
                  console.log('makeQuery');
                  const data = await client.query({
                    query: DECK_STUB,
                  });
                  console.log(data);
                }}
              >
                Make query
              </button>
              <button
                onClick={async () => {
                  console.log('readFromCache');
                  const data = client.readQuery({
                    query: DECK_STUB,
                  });
                  console.log(data);
                }}
              >
                Read from cache
              </button>
              <button
                onClick={async () => {
                  console.log('dehydrate');
                  const data = client.readQuery({
                    query: DECK_STUB,
                  });
                  delete data.rwDeck.owner;
                  client.writeQuery({
                    query: DECK_STUB_ONE,
                    data,
                  });
                }}
              >
                Dehydrate
              </button>
            </>
          );
        }}
      </ApolloConsumer>
    </div>
  );
};

export default App;
