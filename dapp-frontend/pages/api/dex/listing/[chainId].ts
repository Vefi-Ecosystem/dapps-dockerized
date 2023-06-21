import { NextApiRequest, NextApiResponse } from 'next';
import dexListing from "../../../../config/listing";

type DexListing = {
    [key: number]: {
        name: string;
        address: string;
        symbol: string;
        decimals: number;
        logoURI: string;
    }[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { query } = req;
        let chainId = parseInt(query.chainId as string,10);
        const result = (dexListing as DexListing)[chainId]?.sort((a, b) => (a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0));
        return res.status(200).json({ result });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
