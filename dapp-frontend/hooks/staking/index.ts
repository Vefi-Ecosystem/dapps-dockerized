import { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { floor, head } from 'lodash';
import { useGQLContext } from '../../contexts/graphql';
import { useWeb3Context } from '../../contexts/web3';

const ALL_POOLS_QUERY = gql`
  query GetAllPools($skip: Int!) {
    stakingPools(first: 10, skip: $skip) {
      id
      apy
      endsIn
      blockNumber
      blockTimestamp
      stakedToken {
        id
        name
        symbol
      }
      rewardToken {
        id
        name
        symbol
      }
    }
  }
`;

const AVAILABLE_POOLS_QUERY = gql`
  query GetAllAvailablePools($skip: Int!) {
    stakingPools(first: 10, skip: $skip, where: { endsIn_gt: ${floor(Date.now() / 1000)}}) {
      id
      apy
      endsIn
      blockNumber
      blockTimestamp
      stakedToken {
        id
        name
        symbol
      }
      rewardToken {
        id
        name
        symbol
      }
    }
  }
`;

const SOLD_OUT_POOLS_QUERY = gql`
  query GetAllSoldOutPools($skip: Int!) {
    stakingPools(first: 10, skip: $skip, where: { endsIn_lte: ${floor(Date.now() / 1000)}}) {
      id
      apy
      endsIn
      blockNumber
      blockTimestamp
      stakedToken {
        id
        name
        symbol
      }
      rewardToken {
        id
        name
        symbol
      }
    }
  }
`;

const ACCOUNT_POOLS_QUERY = gql`
  query GetAccountPools($skip: Int!, $account: Bytes!) {
    stakingPools(first: 10, skip: $skip, where: { owner: $account }) {
      id
      apy
      endsIn
      blockNumber
      blockTimestamp
      stakedToken {
        id
        name
        symbol
      }
      rewardToken {
        id
        name
        symbol
      }
    }
  }
`;

const STATS_QUERY = gql`
  {
    stakingPoolFactories {
      poolsCount
      stakesCount
    }
  }
`;

export const useAllPools = (page: number) => {
  const { poolsGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await poolsGQLClient?.request(ALL_POOLS_QUERY, { skip: page * 10 });
        setData(req.stakingPools);
        setIsLoading(false);
      } catch (error: any) {
        console.error(error);
        setIsLoading(false);
        setError(new Error('Could not fetch'));
      }
    })();
  }, [page, poolsGQLClient]);

  return { isLoading, data, error };
};

export const useAvailablePools = (page: number) => {
  const { poolsGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await poolsGQLClient?.request(AVAILABLE_POOLS_QUERY, { skip: page * 10 });
        setData(req.stakingPools);
        setIsLoading(false);
      } catch (error: any) {
        console.error(error);
        setIsLoading(false);
        setError(new Error('Could not fetch'));
      }
    })();
  }, [page, poolsGQLClient]);

  return { isLoading, data, error };
};

export const useSoldoutPools = (page: number) => {
  const { poolsGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const req = await poolsGQLClient?.request(SOLD_OUT_POOLS_QUERY, { skip: page * 10 });
        setData(req.stakingPools);
        setIsLoading(false);
      } catch (error: any) {
        console.error(error);
        setIsLoading(false);
        setError(new Error('Could not fetch'));
      }
    })();
  }, [page, poolsGQLClient]);

  return { isLoading, data, error };
};

export const useAllAccountPools = (page: number) => {
  const { poolsGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const { account } = useWeb3Context();

  useEffect(() => {
    if (account)
      (async () => {
        try {
          setIsLoading(true);
          const req = await poolsGQLClient?.request(ACCOUNT_POOLS_QUERY, { skip: page * 10, account });
          setData(req.stakingPools);
          setIsLoading(false);
        } catch (error: any) {
          console.error(error);
          setIsLoading(false);
          setError(new Error('Could not fetch'));
        }
      })();
    else setData([]);
  }, [account, page, poolsGQLClient]);

  return { isLoading, data, error };
};

export const useStakingPoolFactoriesStats = () => {
  const { poolsGQLClient } = useGQLContext();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const req = await poolsGQLClient?.request(STATS_QUERY);
        setData(head(req.stakingPoolFactories));
      } catch (error: any) {
        console.error(error);
      }
    })();
  }, [poolsGQLClient]);
  return data;
};
