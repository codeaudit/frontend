import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export const getLoggedInUserQuery = gql`
  query LoggedInUser {
    LoggedInUser {
      id,
      username,
      firstName,
      lastName,
      avatar,
      collectives {
        id,
        slug,
        name,
        role
      }
    }
  }
`;

export const getCollectiveQuery = gql`
  query Collective($collectiveSlug: String!) {
    Collective(collectiveSlug: $collectiveSlug) {
      id,
      slug,
      name,
      description,
      backgroundImage,
      logo,
      currency
    }
  }
`;

const getEventQuery = gql`
  query Event($collectiveSlug: String!, $eventSlug: String!) {
    Event(collectiveSlug: $collectiveSlug, eventSlug: $eventSlug) {
      id,
      slug,
      createdByUser {
        id
      },
      name,
      description,
      startsAt,
      endsAt,
      timezone,
      location {
        name,
        address,
        lat,
        long
      },
      tiers {
        id,
        type,
        name,
        description,
        amount,
        currency,
        maxQuantity
      },
      collective {
        id,
        slug,
        name,
        mission,
        currency,
        backgroundImage,
        logo,
        stripePublishableKey
      },
      responses {
        id,
        createdAt,
        quantity,
        status,
        description,
        user {
          name,
          avatar,
          username,
          twitterHandle,
          description,
          email
        },
        tier {
          name
        }
      }
    }
  }
`;

const getEventsQuery = gql`
  query allEvents($collectiveSlug: String) {
    allEvents(collectiveSlug: $collectiveSlug) {
      id,
      slug,
      name,
      description,
      startsAt,
      endsAt,
      timezone,
      location {
        name,
        address,
        lat,
        long
      },
      tiers {
        id,
        type,
        name,
        description,
        amount
      },
      collective {
        id,
        slug,
        name,
        mission,
        backgroundImage,
        logo
      }
    }
  }
`;

const getAttendeesQuery = gql`
  query Event($collectiveSlug: String!, $eventSlug: String!) {
    Event(collectiveSlug: $collectiveSlug, eventSlug: $eventSlug) {
      slug,
      name,
      startsAt,
      location {
        name,
        address
      },
      responses {
        id,
        createdAt,
        quantity,
        status,
        description,
        user {
          id,
          firstName,
          lastName,
          avatar,
          username,
          twitterHandle,
          description
        },
        tier {
          name
        }
      }
    }
  }
`;

const getCollectiveTransactionsQuery = gql`
  query CollectiveTransactions($collectiveSlug: String!, $type: String, $limit: Int, $offset: Int) {
    Collective(collectiveSlug: $collectiveSlug) {
      id,
      slug,
      name,
      currency,
      backgroundImage,
      settings,
      logo
    }
    allTransactions(collectiveSlug: $collectiveSlug, type: $type, limit: $limit, offset: $offset) {
      id,
      uuid,
      title,
      createdAt,
      type,
      amount,
      currency,
      netAmountInGroupCurrency,
      hostFeeInTxnCurrency,
      platformFeeInTxnCurrency,
      paymentProcessorFeeInTxnCurrency,
      paymentMethod {
        name
      },
      user {
        id,
        name,
        username,
        avatar
      },
      host {
        id,
        name
      }
      ... on Expense {
        category
        attachment
      }
      ... on Donation {
        subscription {
          interval
        }
      }
    }
  }
`;

const getTransactionQuery = gql`
  query Transaction($id: Int!) {
    Transaction(id: $id) {
      id,
      uuid,
      title,
      createdAt,
      type,
      amount,
      currency,
      netAmountInGroupCurrency,
      hostFeeInTxnCurrency,
      platformFeeInTxnCurrency,
      paymentProcessorFeeInTxnCurrency,
      paymentMethod {
        name
      },
      user {
        id,
        name,
        username,
        avatar
      },
      host {
        id,
        name
      }
      ... on Expense {
        category
        attachment
      }
      ... on Donation {
        subscription {
          interval
        }
      }
    }
  }
`;

const TRANSACTIONS_PER_PAGE = 10;
export const addCollectiveTransactionsData = graphql(getCollectiveTransactionsQuery, {
  options(props) {
    return {
      variables: {
        collectiveSlug: props.collectiveSlug,
        offset: 0,
        limit: TRANSACTIONS_PER_PAGE * 2
      }
    }
  },
  props: ({ data }) => ({
    data,
    fetchMore: () => {
      return data.fetchMore({
        variables: {
          offset: data.allTransactions.length,
          limit: TRANSACTIONS_PER_PAGE
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult
          }
          return Object.assign({}, previousResult, {
            // Append the new posts results to the old one
            allTransactions: [...previousResult.allTransactions, ...fetchMoreResult.allTransactions]
          })
        }
      })
    }
  })  
});
export const addCollectiveData = graphql(getCollectiveQuery);
export const addEventData = graphql(getEventQuery);
export const addEventsData = graphql(getEventsQuery);
export const addAttendeesData = graphql(getAttendeesQuery);

export const addGetTransaction = (component) => {
  const accessToken = typeof window !== 'undefined' && window.localStorage.getItem('accessToken');

  // if we don't have an accessToken, there is no need to get the details of a transaction
  // as we won't have access to any more information than the allTransactions query
  if (!accessToken) return component;

  return graphql(getTransactionQuery, {
    options(props) {
      return {
        variables: {
          id: props.transaction.id
        }
      }
    }
  })(component);
}

export const addGetLoggedInUserFunction = (component) => {
  const accessToken = typeof window !== 'undefined' && window.localStorage.getItem('accessToken');
  if (!accessToken) return component;
  return graphql(getLoggedInUserQuery, {
    props: ({ data }) => ({
      data,
      getLoggedInUser: (collectiveSlug) => {
        if (window.localStorage.getItem('accessToken')) {
          return new Promise((resolve) => {
            setTimeout(async () => {
              return data.refetch()
                .then(res => {
                  if (res.data && res.data.LoggedInUser) {
                    const LoggedInUser = {...res.data.LoggedInUser};
                    if (LoggedInUser && LoggedInUser.collectives && collectiveSlug) {
                      const membership = LoggedInUser.collectives.find(c => c.slug === collectiveSlug);
                      LoggedInUser.membership = membership;
                    }
                    console.log(">>> LoggedInUser", LoggedInUser);
                    return resolve(LoggedInUser);
                  }
                })
                .catch(e => {
                  console.error(">>> getLoggedInUserQuery error", e);
                  return resolve(null);
                });
            }, 0);
          });
        }
      }
    })
  })(component);
}