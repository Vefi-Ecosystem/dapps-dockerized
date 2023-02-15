import { useMemo, useState, MouseEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiChevronRight, FiCopy, FiExternalLink } from 'react-icons/fi';
import { AddressZero } from '@ethersproject/constants';
import millify from 'millify';
import { TailSpin } from 'react-loader-spinner';
import { ResponsiveContainer } from 'recharts';
import { map, multiply } from 'lodash';
import { useAPIContext } from '../../contexts/api';
import { useSingleTokenChartData, useSingleTokenQuery } from '../../hooks/analytics';
import SquareToggleButton from '../../components/Button/SquareToggleButton';
import BarChart from '../../components/Chart/BarChart';
import { useWeb3Context } from '../../contexts/web3';
import chains from '../../assets/chains.json';
import { TBody, TCell, THead, TRow, Table } from '../../components/Table';
import Pagination from '../../components/Pagination';

enum Tabs {
  OVERVIEW = 'overview',
  PAIRS = 'pairs',
  TXNS = 'transactions'
}

enum ChartView {
  TX = 'transactions',
  VOL = 'volume',
  LIQ = 'liquidity',
  PRICE = 'price'
}

enum ChartPeriod {
  H24 = 86400,
  D3 = 259200,
  D7 = 604800,
  M1 = 2419200,
  Y1 = 29030400
}

enum TransactionView {
  ALL = 'all',
  SWAPS = 'swaps',
  ADDS = 'adds',
  REMOVES = 'removes'
}

const FilterBtn = ({ isActive, onClick, children }: { isActive: boolean; onClick: (event?: MouseEvent) => any; children: any }) => (
  <button
    className={`${
      isActive ? 'bg-[#373b4f] rounded-[6px] text-[#a6b2ec]' : 'bg-transparent text-[#cdcccc]'
    } py-2 px-2 flex justify-center text-[0.3em] lg:text-[0.65em] font-Poppins font-[400]`}
    onClick={onClick}
  >
    {children}
  </button>
);

const OverviewChart = ({ period, token }: { period: ChartPeriod; token: string }) => {
  const { query, push, asPath } = useRouter();
  const chartView = useMemo(() => (query.chartView as ChartView) || ChartView.TX, [query.chartView]);
  const { isLoading, data } = useSingleTokenChartData(period, token);
  const { data: statData } = useSingleTokenQuery(token);
  const [hoverDate, setHoverDate] = useState<string | undefined>(undefined);
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
  const barDataKey = useMemo(() => {
    if (chartView === ChartView.TX) return 'dailyTxns';
    else if (chartView === ChartView.VOL) return 'dailyVolumeUSD';
    else if (chartView === ChartView.PRICE) return 'priceUSD';
    else return 'totalLiquidityUSD';
  }, [chartView]);

  return (
    <div className="w-full px-4 py-4 border border-[#5d5d5d] rounded-[8px] min-h-[24rem]">
      <div className="flex flex-col gap-5 justify-center items-start w-full">
        <div className="flex justify-start items-center gap-0 w-auto bg-[#fff]/[.07] rounded-[6px] px-1 py-1">
          <FilterBtn
            isActive={chartView === ChartView.TX}
            onClick={() =>
              push(`${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${token}&tab=${Tabs.OVERVIEW}&chartView=${ChartView.TX}`)
            }
          >
            <span>Transactions</span>
          </FilterBtn>
          <FilterBtn
            isActive={chartView === ChartView.VOL}
            onClick={() =>
              push(
                `${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${token}&tab=${Tabs.OVERVIEW}&chartView=${ChartView.VOL}`
              )
            }
          >
            <span>Volume</span>
          </FilterBtn>
          <FilterBtn
            isActive={chartView === ChartView.LIQ}
            onClick={() =>
              push(
                `${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${token}&tab=${Tabs.OVERVIEW}&chartView=${ChartView.LIQ}`
              )
            }
          >
            <span>Liquidity</span>
          </FilterBtn>
          <FilterBtn
            isActive={chartView === ChartView.PRICE}
            onClick={() =>
              push(
                `${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${token}&tab=${Tabs.OVERVIEW}&chartView=${ChartView.PRICE}`
              )
            }
          >
            <span>Price</span>
          </FilterBtn>
        </div>
        <TailSpin color="#dcdcdc" visible={isLoading} width={60} height={60} />
        <div className="flex flex-col gap-1 justify-center items-center">
          <span className="text-[#fff] font-Syne font-[500] text-[1.35em]">
            {chartView !== ChartView.TX && '$'}
            {hoverValue ??
              (statData &&
                millify(
                  chartView === ChartView.TX
                    ? statData.txCount
                    : chartView === ChartView.VOL
                    ? statData.tradeVolumeUSD
                    : chartView === ChartView.PRICE
                    ? statData.derivedUSD
                    : statData.totalLiquidity * statData.derivedUSD
                ))}
          </span>
          <span className="text-[#23e33e] font-Syne font-[400] text-[0.85em]">
            {hoverDate ??
              new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                day: 'numeric',
                month: 'short'
              })}
          </span>
        </div>
        {data && data.length > 0 && (
          <div className="flex justify-center items-center w-full min-h-[26rem]">
            <ResponsiveContainer width={'100%'} height={416}>
              <BarChart
                data={map(data, (item) => ({
                  date: new Date(multiply(item.date, 1000)),
                  dailyTxns: parseInt(item.dailyTxns),
                  dailyVolumeUSD: parseFloat(item.dailyVolumeUSD),
                  priceUSD: parseFloat(item.priceUSD),
                  totalLiquidityUSD: parseFloat(item.totalLiquidityUSD)
                }))}
                width={350}
                height={350}
                xAxisDataKey="date"
                barDataKey={barDataKey}
                hideXAxis={false}
                hideYAxis={false}
                yAxisOrientation="left"
                fill="#58bd7d"
                tooltiped
                setHoverDate={setHoverDate}
                setHoverValue={setHoverValue}
              />
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const PairsList = ({ token }: { token: string }) => {
  const { tokensListingAsDictionary } = useAPIContext();
  const { chainId } = useWeb3Context();
  const [page, setPage] = useState<number>(1);
  const { isLoading, data, error } = useSingleTokenQuery(token);
  const chain = useMemo(() => chains[chainId as unknown as keyof typeof chains], [chainId]);
  return (
    <>
      {data && (
        <div className="w-full px-3 py-2 flex flex-col gap-3 justify-center items-center overflow-auto hidden-scrollbar">
          <Table>
            <THead>
              <TRow>
                <TCell className="text-left py-2">
                  <span className="capitalize">pair</span>
                </TCell>
                <TCell className="text-center py-2">
                  <span className="capitalize">volume</span>
                </TCell>
                <TCell className="text-center py-2 hidden lg:table-cell">
                  <span className="capitalize">reserve {chain.symbol}</span>
                </TCell>
                <TCell className="text-center py-2 hidden lg:table-cell">
                  <span className="capitalize">token trade volume</span>
                </TCell>
                <TCell className="text-center py-2 hidden lg:table-cell">
                  <span className="capitalize">token trade volume</span>
                </TCell>
                <TCell className="text-center py-2">
                  <span className="capitalize">action</span>
                </TCell>
              </TRow>
            </THead>
            <TBody>
              <TailSpin color="#dcdcdc" visible={isLoading} width={20} height={20} />
              {error ? (
                <span className="font-Poppins text-red-500 text-[0.87em]">{error.message}</span>
              ) : (
                <>
                  {map(data.pairBase.concat(data.pairQuote).slice((page - 1) * 10, page * 10), (item, index) => (
                    <TRow key={index}>
                      <TCell className="text-center py-4">
                        <div className="flex justify-start items-center gap-2 w-full">
                          <div className="flex justify-center items-center gap-1">
                            <div className="avatar">
                              <div className="w-6 rounded-full border border-[#353535]">
                                <img
                                  src={
                                    tokensListingAsDictionary[item.token0.id]
                                      ? tokensListingAsDictionary[item.token0.id].logoURI
                                      : '/images/placeholder_image.svg'
                                  }
                                  alt={item.token0.symbol}
                                />
                              </div>
                            </div>
                            <div className="avatar">
                              <div className="w-6 rounded-full border border-[#353535]">
                                <img
                                  src={
                                    tokensListingAsDictionary[item.token1.id]
                                      ? tokensListingAsDictionary[item.token1.id].logoURI
                                      : '/images/placeholder_image.svg'
                                  }
                                  alt={item.token1.symbol}
                                />
                              </div>
                            </div>
                          </div>
                          <span className="font-Syne text-[#fff] text-[700] text-[0.5em] lg:text-[0.85em] uppercase">
                            {item.token0.symbol}/{item.token1.symbol}
                          </span>
                        </div>
                      </TCell>
                      <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.5em] lg:text-[0.85em] font-[400]">
                        ${millify(parseFloat(item.volumeUSD))}
                      </TCell>
                      <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400] hidden lg:table-cell">
                        {millify(parseFloat(item.reserveETH))}
                      </TCell>
                      <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400] hidden lg:table-cell">
                        {millify(parseFloat(item.token0.tradeVolume))} {item.token0.symbol}
                      </TCell>
                      <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400] hidden lg:table-cell">
                        {millify(parseFloat(item.token1.tradeVolume))} {item.token1.symbol}
                      </TCell>
                      <TCell className="text-center">
                        <Link href={`/dex?tab=swap&inputToken=${item.token0.id}&outputToken=${item.token1.id}`}>
                          <span className="capitalize font-Syne font-[400] text-[0.5em] lg:text-[0.85em] text-[#6093df] cursor-pointer">trade</span>
                        </Link>
                      </TCell>
                    </TRow>
                  ))}
                </>
              )}
            </TBody>
          </Table>
          <Pagination currentPage={page} itemsPerPage={10} onPageChange={setPage} dataLength={data.pairBase.concat(data.pairQuote).length} />
        </div>
      )}
    </>
  );
};

const useTokenViewRoutes = (tab: Tabs, token: string, period: number = 0) => {
  // eslint-disable-next-line react/display-name
  const [component, setComponent] = useState(() => () => OverviewChart({ period, token }));

  useEffect(() => {
    if (token) {
      switch (tab) {
        case Tabs.OVERVIEW:
          setComponent(() => () => OverviewChart({ period, token }));
          break;
        case Tabs.PAIRS:
          setComponent(() => () => PairsList({ token }));
          break;
        default:
          // eslint-disable-next-line react/display-name
          setComponent(() => () => OverviewChart({ period, token }));
          break;
      }
    }
  }, [tab, period, token]);
  return component;
};

export default function SingleTokenView() {
  const { query, asPath, push } = useRouter();
  const tab = useMemo(() => (query.tab as Tabs) || Tabs.OVERVIEW, [query.tab]);
  const { tokensListingAsDictionary } = useAPIContext();
  const [chartPeriod, setChartPeriod] = useState(ChartPeriod.H24);
  const { data, isLoading } = useSingleTokenQuery(query.token as string);
  const RenderedChild = useTokenViewRoutes(tab, query.token as string, chartPeriod);
  return (
    <div className="flex container mx-auto flex-col justify-center items-start gap-8 px-8 lg:px-10">
      <div className="flex justify-start items-center w-full font-Syne text-[#808080] font-[500] text-[0.7em] lg:text-[0.8em] gap-2 capitalize">
        <Link href="/analytics?view=allStats">analytics</Link>
        <FiChevronRight />
        <Link href="/analytics?view=allStats&tab=tokens">tokens</Link>
        <FiChevronRight />
        <span className="text-[#105dcf]">view token</span>
      </div>
      <TailSpin color="#dcdcdc" visible={isLoading} width={20} height={20} />
      {query.token && data && (
        <>
          <div className="flex justify-between items-center gap-2 w-full">
            <div className="flex justify-center items-center gap-3">
              <div className="avatar">
                <div className="w-14 rounded-full">
                  <img
                    src={tokensListingAsDictionary[data.id] ? tokensListingAsDictionary[data.id].logoURI : '/images/placeholder_image.svg'}
                    alt={data.symbol}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="flex justify-center items-center gap-2">
                  <span className="capitalize font-Syne text-[#fff] font-[700] text-[0.6em] lg:text-[1.2em]">{data.name}</span>
                  <span className="uppercase font-Syne text-[#868686] font-[700] text-[0.58em] lg:text-[1.12em]">({data.symbol})</span>
                  <FiExternalLink className="text-[#a6b2ec] text-[0.58em] lg:text-[1.12em]" />
                  <FiCopy className="text-[#a6b2ec] text-[0.58em] lg:text-[1.12em]" />
                </div>
                <span className="capitalize font-Poppins text-[#fff] font-[400] text-[0.58em] lg:text-[1.12em]">
                  ${millify(parseFloat(data.derivedUSD))}
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center gap-3">
              <Link href={`/dex?tab=swap&inputToken=${query.token}&outputToken=${AddressZero}`}>
                <button className="capitalize font-Inter font-[500] border border-[#3878d7] text-[0.5em] lg:text-[0.85em] bg-[#0c0c0c] text-[#3878d7] rounded-[8px] lg:px-4 px-1 lg:py-2 py-1 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)]">
                  add liquidity
                </button>
              </Link>
              <Link href={`/dex?tab=swap&inputToken=${query.token}&outputToken=${AddressZero}`}>
                <button className="capitalize font-Inter font-[500] border border-[#105dcf] text-[0.5em] lg:text-[0.85em] bg-[#105dcf] text-[#fff] rounded-[8px] lg:px-4 px-1 lg:py-2 py-1 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)]">
                  trade
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-between items-start border-t border-[#353535] w-full px-2 py-2 overflow-auto hidden-scrollbar">
            <div className="flex justify-start items-center gap-2 lg:gap-4 w-auto">
              <SquareToggleButton
                isActive={tab === Tabs.OVERVIEW}
                onClick={() =>
                  push(`${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${query.token as string}&tab=${Tabs.OVERVIEW}`)
                }
              >
                <span>Overview</span>
              </SquareToggleButton>
              <SquareToggleButton
                isActive={tab === Tabs.PAIRS}
                onClick={() =>
                  push(`${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${query.token as string}&tab=${Tabs.PAIRS}`)
                }
              >
                <span>Pairs</span>
              </SquareToggleButton>
              <SquareToggleButton
                isActive={tab === Tabs.TXNS}
                onClick={() =>
                  push(`${new URL(asPath, window.location.href).pathname}?view=singleToken&token=${query.token as string}&tab=${Tabs.TXNS}`)
                }
              >
                <span>Transactions</span>
              </SquareToggleButton>
            </div>
            {tab === Tabs.OVERVIEW && (
              <div className="flex justify-start items-center gap-0 w-auto bg-[#fff]/[.07] border border-[#555555] rounded-[6px] px-0 py-0">
                <FilterBtn isActive={chartPeriod === ChartPeriod.H24} onClick={() => setChartPeriod(ChartPeriod.H24)}>
                  <span>24H</span>
                </FilterBtn>
                <FilterBtn isActive={chartPeriod === ChartPeriod.D3} onClick={() => setChartPeriod(ChartPeriod.D3)}>
                  <span>3D</span>
                </FilterBtn>
                <FilterBtn isActive={chartPeriod === ChartPeriod.D7} onClick={() => setChartPeriod(ChartPeriod.D7)}>
                  <span>7D</span>
                </FilterBtn>
                <FilterBtn isActive={chartPeriod === ChartPeriod.M1} onClick={() => setChartPeriod(ChartPeriod.M1)}>
                  <span>1M</span>
                </FilterBtn>
                <FilterBtn isActive={chartPeriod === ChartPeriod.Y1} onClick={() => setChartPeriod(ChartPeriod.Y1)}>
                  <span>1Y</span>
                </FilterBtn>
              </div>
            )}
          </div>
          <RenderedChild />
        </>
      )}
    </div>
  );
}
