/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { head } from 'lodash';
import { useGQLContext } from '../../contexts/graphql';

const HIGHEST_VOLUME_QUERY = gql`
  query GetTokenDayData($date: Int!) {
    tokenDayDatas(orderBy: dailyVolumeToken, orderDirection: desc, where: { date_gte: $date }) {
      token {
        name
        id
        symbol
      }
    }
  }
`;

const TRANSACTION_COUNT_QUERY = gql`
  query GetTokenDayData($date: Int!) {
    tokenDayDatas(orderBy: dailyTxns, orderDirection: desc, where: { date_gte: $date }) {
      token {
        name
        id
        symbol
      }
    }
  }
`;

const PAIRS_QUERY = gql`
  {
    pairs(orderBy: txCount, orderDirection: desc) {
      token0 {
        name
        id
        symbol
      }
      token1 {
        name
        id
        symbol
      }
    }
  }
`;

const TOKENS_QUERY = gql`
  {
    tokens(orderBy: txCount, orderDirection: desc) {
      id
      name
      symbol
    }
  }
`;

const TOP_PAIRS_QUERY = gql`
  query GetTopPairs($skip: Int!) {
    pairs(orderBy: volumeUSD, orderDirection: desc, first: 10, skip: $skip) {
      volumeUSD
      reserveETH
      token0 {
        id
        name
        symbol
        tradeVolume
      }
      token1 {
        id
        name
        symbol
        tradeVolume
      }
    }
  }
`;

export const useHighestVolumeToken = () => {
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ name: string; id: string; symbol: string }>();
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await dexGQLClient.request(HIGHEST_VOLUME_QUERY, { date: Math.floor(Date.now() / 1000) - 3600 * 24 });
        setData((head(req.tokenDayDatas) as any).token);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        setError(new Error('Could not fetch'));
        setIsLoading(false);
      }
    })();
  }, [dexGQLClient]);

  return { isLoading, data, error };
};

export const useHighestTransactionToken = () => {
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ name: string; id: string; symbol: string }>();
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await dexGQLClient.request(TRANSACTION_COUNT_QUERY, { date: Math.floor(Date.now() / 1000) - 3600 * 24 });
        setData((head(req.tokenDayDatas) as any).token);
        setIsLoading(false);
      } catch (error: any) {
        setError(new Error('Could not fetch'));
        setIsLoading(false);
      }
    })();
  }, [dexGQLClient]);

  return { isLoading, data, error };
};

export const useTopPair = () => {
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ token0: { name: string; id: string; symbol: string }; token1: { name: string; id: string; symbol: string } }>();
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await dexGQLClient.request(PAIRS_QUERY);
        setData(head(req.pairs) as any);
        setIsLoading(false);
      } catch (error: any) {
        setError(new Error('Could not fetch'));
        setIsLoading(false);
      }
    })();
  }, [dexGQLClient]);

  return { isLoading, data, error };
};

export const useMostPopularToken = () => {
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ name: string; id: string; symbol: string }>();
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await dexGQLClient.request(TOKENS_QUERY);
        setData(head(req.tokens) as any);
        setIsLoading(false);
      } catch (error: any) {
        setError(new Error('Could not fetch'));
        setIsLoading(false);
      }
    })();
  }, [dexGQLClient]);

  return { isLoading, data, error };
};

export const useTopPairs = (page: number) => {
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<any>>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await dexGQLClient.request(TOP_PAIRS_QUERY, { skip: page * 10 });
        setData(req.pairs);
        setIsLoading(false);
      } catch (error: any) {
        setError(new Error('Could not fetch'));
        setIsLoading(false);
      }
    })();
  }, [page, dexGQLClient]);

  return { isLoading, data, error };
};
