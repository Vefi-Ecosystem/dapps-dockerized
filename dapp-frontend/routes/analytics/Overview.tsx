import { useMemo, MouseEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TailSpin } from 'react-loader-spinner';
import { map } from 'lodash';
import millify from 'millify';
import { useHighestTransactionToken, useHighestVolumeToken, useMostPopularToken, useTopPair, useTopPairs } from '../../hooks/analytics';
import { useAPIContext } from '../../contexts/api';
import SquareToggleButton from '../../components/Button/SquareToggleButton';
import { TBody, TCell, THead, TRow, Table } from '../../components/Table';

enum Tabs {
  OVERVIEW = 'overview',
  PAIRS = 'pairs',
  TOKENS = 'tokens',
  TXNS = 'transactions'
}

const FilterBtn = ({ isActive, onClick, children }: { isActive: boolean; onClick: (event?: MouseEvent) => any; children: any }) => (
  <button
    className={`${
      isActive ? 'bg-[#373b4f] rounded-[6px] text-[#a6b2ec]' : 'bg-transparent text-[#cdcccc]'
    } py-3 px-3 flex justify-center text-[0.3em] lg:text-[0.65em] font-Poppins font-[400]`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TopPairsList = () => {
  const { tokensListingAsDictionary } = useAPIContext();
  const [page, setPage] = useState<number>(0);
  const { isLoading, data, error } = useTopPairs(page);
  return (
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
            <TCell className="text-center py-2">
              <span className="capitalize">reserve ETH</span>
            </TCell>
            <TCell className="text-center py-2">
              <span className="capitalize">token trade volume</span>
            </TCell>
            <TCell className="text-center py-2">
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
              {map(data, (item, index) => (
                <TRow key={index}>
                  <TCell className="text-center py-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="flex justify-center items-center gap-1">
                        <div className="avatar">
                          <div className="w-6 rounded-full border border-[#dcdcdc]">
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
                          <div className="w-6 rounded-full border border-[#dcdcdc]">
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
                      <span className="font-Syne text-[#fff] text-[700] text-[0.85em] uppercase">
                        {item.token0.symbol}/{item.token1.symbol}
                      </span>
                    </div>
                  </TCell>
                  <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400]">${millify(parseFloat(item.volumeUSD))}</TCell>
                  <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400]">{millify(parseFloat(item.reserveETH))}</TCell>
                  <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400]">
                    {millify(parseFloat(item.token0.tradeVolume))} {item.token0.symbol}
                  </TCell>
                  <TCell className="text-center py-4 text-[#fff] font-Poppins text-[0.86em] font-[400]">
                    {millify(parseFloat(item.token1.tradeVolume))} {item.token1.symbol}
                  </TCell>
                </TRow>
              ))}
            </>
          )}
        </TBody>
      </Table>
    </div>
  );
};

const useOverviewRoutes = (tab: Tabs) => {
  // eslint-disable-next-line react/display-name
  const [component, setComponent] = useState(() => () => <div></div>);

  useEffect(() => {
    switch (tab) {
      case Tabs.PAIRS:
        setComponent(() => TopPairsList);
        break;
      default:
        // eslint-disable-next-line react/display-name
        setComponent(() => () => <div></div>);
        break;
    }
  }, [tab]);
  return component;
};

export default function Overview() {
  const { query, push, asPath } = useRouter();
  const tab = useMemo(() => (query.tab as Tabs) || Tabs.OVERVIEW, [query.tab]);
  const { tokensListingAsDictionary } = useAPIContext();
  const { isLoading: isHighestVolumeDataLoading, data: highestVolumeData, error: highestVolumeFetchError } = useHighestVolumeToken();
  const {
    isLoading: isHighestTransactionDataLoading,
    data: highestTransactionData,
    error: highestTransactionFetchError
  } = useHighestTransactionToken();
  const { isLoading: isTopPairDataLoading, data: topPairData, error: topPairFetchError } = useTopPair();
  const { isLoading: isMostPopularTokenDataLoading, data: mostPopularTokenData, error: mostPopularTokenFetchError } = useMostPopularToken();
  const RenderedComponent = useOverviewRoutes(tab);
  return (
    <div className="flex flex-col justify-center items-center w-full px-6 py-7 gap-12">
      <div className="flex justify-center items-center w-full px-1">
        <div className="carousel carousel-center p-4 space-x-6 rounded-box">
          <div className="carousel-item flex-col flex justify-center items-center gap-4 border border-[#5d5d5d] rounded-[10px] px-3 py-3 min-w-[193px]">
            {highestVolumeFetchError ? (
              <span className="font-Poppins text-red-500 text-[0.87em]">{highestVolumeFetchError.message}</span>
            ) : (
              <>
                <TailSpin color="#dcdcdc" visible={isHighestVolumeDataLoading} width={20} height={20} />
                {highestVolumeData && (
                  <>
                    <span className="font-Syne font-[400] text-[#fff]/50 text-[0.87em] capitalize">highest trade volume (24h)</span>
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            tokensListingAsDictionary[highestVolumeData.id]
                              ? tokensListingAsDictionary[highestVolumeData.id].logoURI
                              : '/images/placeholder_image.svg'
                          }
                          alt={highestVolumeData.symbol}
                        />
                      </div>
                    </div>
                    <div className="font-Syne text-[0.95em] flex justify-center items-center gap-1 w-full">
                      <span className="text-[#fff] capitalize">{highestVolumeData.name}</span>
                      <span className="text-[#fff]/50 uppercase">{highestVolumeData.symbol}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="carousel-item flex-col flex justify-center items-center gap-4 border border-[#5d5d5d] rounded-[10px] px-3 py-3 min-w-[193px]">
            {highestTransactionFetchError ? (
              <span className="font-Poppins text-red-500 text-[0.87em]">{highestTransactionFetchError.message}</span>
            ) : (
              <>
                <TailSpin color="#dcdcdc" visible={isHighestTransactionDataLoading} width={20} height={20} />
                {highestTransactionData && (
                  <>
                    <span className="font-Syne font-[400] text-[#fff]/50 text-[0.87em] capitalize">most traded token (24h)</span>
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            tokensListingAsDictionary[highestTransactionData.id]
                              ? tokensListingAsDictionary[highestTransactionData.id].logoURI
                              : '/images/placeholder_image.svg'
                          }
                          alt={highestTransactionData.symbol}
                        />
                      </div>
                    </div>
                    <div className="font-Syne text-[0.95em] flex justify-center items-center gap-1 w-full">
                      <span className="text-[#fff] capitalize">{highestTransactionData.name}</span>
                      <span className="text-[#fff]/50 uppercase">{highestTransactionData.symbol}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="carousel-item flex-col flex justify-center items-center gap-4 border border-[#5d5d5d] rounded-[10px] px-3 py-3 min-w-[193px]">
            {topPairFetchError ? (
              <span className="font-Poppins text-red-500 text-[0.87em]">{topPairFetchError.message}</span>
            ) : (
              <>
                <TailSpin color="#dcdcdc" visible={isTopPairDataLoading} width={20} height={20} />
                {topPairData && (
                  <>
                    <span className="font-Syne font-[400] text-[#fff]/50 text-[0.87em] capitalize">top pair</span>
                    <div className="flex justify-center items-center gap-1">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              tokensListingAsDictionary[topPairData.token0.id]
                                ? tokensListingAsDictionary[topPairData.token0.id].logoURI
                                : '/images/placeholder_image.svg'
                            }
                            alt={topPairData.token0.symbol}
                          />
                        </div>
                      </div>
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              tokensListingAsDictionary[topPairData.token1.id]
                                ? tokensListingAsDictionary[topPairData.token1.id].logoURI
                                : '/images/placeholder_image.svg'
                            }
                            alt={topPairData.token1.symbol}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="font-Syne text-[0.95em] flex justify-center items-center gap-1 w-full">
                      <span className="text-[#fff]/50 uppercase">{topPairData.token0.symbol}</span>
                      <span className="text-[#fff]/50 uppercase">{topPairData.token1.symbol}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="carousel-item flex-col flex justify-center items-center gap-4 border border-[#5d5d5d] rounded-[10px] px-3 py-3 min-w-[193px]">
            {mostPopularTokenFetchError ? (
              <span className="font-Poppins text-red-500 text-[0.87em]">{highestTransactionFetchError.message}</span>
            ) : (
              <>
                <TailSpin color="#dcdcdc" visible={isMostPopularTokenDataLoading} width={20} height={20} />
                {mostPopularTokenData && (
                  <>
                    <span className="font-Syne font-[400] text-[#fff]/50 text-[0.87em] capitalize">most popular token</span>
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img
                          src={
                            tokensListingAsDictionary[mostPopularTokenData.id]
                              ? tokensListingAsDictionary[mostPopularTokenData.id].logoURI
                              : '/images/placeholder_image.svg'
                          }
                          alt={mostPopularTokenData.symbol}
                        />
                      </div>
                    </div>
                    <div className="font-Syne text-[0.95em] flex justify-center items-center gap-1 w-full">
                      <span className="text-[#fff] capitalize">{mostPopularTokenData.name}</span>
                      <span className="text-[#fff]/50 uppercase">{mostPopularTokenData.symbol}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start border-b border-[#353535] w-full px-2 py-2 overflow-auto hidden-scrollbar">
        <div className="flex justify-start items-center gap-2 lg:gap-4 w-auto">
          <SquareToggleButton
            isActive={tab === Tabs.OVERVIEW}
            onClick={() => push(`${new URL(asPath, window.location.href).pathname}?tab=${Tabs.OVERVIEW}`)}
          >
            <span>Overview</span>
          </SquareToggleButton>
          <SquareToggleButton
            isActive={tab === Tabs.PAIRS}
            onClick={() => push(`${new URL(asPath, window.location.href).pathname}?tab=${Tabs.PAIRS}`)}
          >
            <span>Pairs</span>
          </SquareToggleButton>
          <SquareToggleButton
            isActive={tab === Tabs.TOKENS}
            onClick={() => push(`${new URL(asPath, window.location.href).pathname}?tab=${Tabs.TOKENS}`)}
          >
            <span>Tokens</span>
          </SquareToggleButton>
          <SquareToggleButton isActive={tab === Tabs.TXNS} onClick={() => push(`${new URL(asPath, window.location.href).pathname}?tab=${Tabs.TXNS}`)}>
            <span>Transactions</span>
          </SquareToggleButton>
        </div>
        {tab === Tabs.OVERVIEW && (
          <div className="flex justify-start items-center gap-0 w-auto bg-[#fff]/[.07] border border-[#555555] rounded-[6px] px-0 py-0">
            <FilterBtn isActive={true} onClick={() => {}}>
              <span>24H</span>
            </FilterBtn>
            <FilterBtn isActive={false} onClick={() => {}}>
              <span>3D</span>
            </FilterBtn>
            <FilterBtn isActive={false} onClick={() => {}}>
              <span>7D</span>
            </FilterBtn>
            <FilterBtn isActive={false} onClick={() => {}}>
              <span>1M</span>
            </FilterBtn>
            <FilterBtn isActive={false} onClick={() => {}}>
              <span>1Y</span>
            </FilterBtn>
          </div>
        )}
      </div>
      <RenderedComponent />
    </div>
  );
}
