import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetBridgeTokenList = (chainId: number) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [chainTokenList, setChainTokenList] = useState<any[] | null>([{}]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get<Record<string, any>>(`https://bridgeapi.anyswap.exchange/v4/tokenlistv4/${chainId}`);
                let tokens: any[] = [];
                Object.entries(data).forEach(([key, value]: any) => {
                    tokens.push(value);
                })
                setChainTokenList(tokens);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        })();
    }, [chainId])

    return { isLoading, chainTokenList };
}

export const useGetBridgeChainList = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [chainList, setChainList] = useState<any[] | null>([{}]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get<Record<string, any>>('https://bridgeapi.anyswap.exchange/data/bridgeChainInfo');
                let chains: any[] = [];
                Object.entries(data).forEach(([key, value]: any) => {
                    const { name, symbol, rpc, explorer, explorer_cn, logoUrl, networkType, destChain } = value;
                    const network = {
                        chainId: key, name, symbol, rpc, explorer, explorer_cn, logoUrl, networkType, destChain
                    }
                    chains.push(network)
                })
                setChainList(chains);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        })
    }, [])

    return { isLoading, chainList };
}