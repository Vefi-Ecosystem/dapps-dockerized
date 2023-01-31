import { useMemo, createContext, useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { useWeb3Context } from './web3';
import grapqlConfig from '../assets/graphql.json';

type GraphQLContextType = {
  dexGQLClient: GraphQLClient;
};

const GQLContext = createContext<GraphQLContextType>({} as GraphQLContextType);

export const GQLProvider = ({ children }: any) => {
  const { chainId } = useWeb3Context();
  const gqlConfig = useMemo(() => grapqlConfig[chainId as unknown as keyof typeof grapqlConfig], [chainId]);
  const dexGQLClient = useMemo(() => new GraphQLClient(`${gqlConfig.root}${gqlConfig.slugs.exchange}`), [gqlConfig.root, gqlConfig.slugs.exchange]);

  return <GQLContext.Provider value={{ dexGQLClient }}>{children}</GQLContext.Provider>;
};

export const useGQLContext = () => useContext(GQLContext);
