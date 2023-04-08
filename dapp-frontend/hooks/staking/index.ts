import { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { head } from 'lodash';
import { useGQLContext } from '../../contexts/graphql';

const ALL_POOLS_QUERY = gql`
  query GetAllPairs($skip: Int!) {
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
