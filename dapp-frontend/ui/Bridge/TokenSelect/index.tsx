import { useState, useEffect } from 'react';
import { useGetBridgeTokenList } from "../../../hooks/api/bridge";
import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineSearch, AiOutlineCloseCircle } from 'react-icons/ai';
import { TailSpin } from 'react-loader-spinner';

type TokenSelectProps = {
    chainId: number;
    onClose: () => void;
    isVisible: boolean;
    onTokenSelected: (token: object) => void;
    selectedToken: object;
    tokenList: any[] | null;
}

const TokenSelect = (
    { chainId, onClose, isVisible, tokenList, onTokenSelected }: TokenSelectProps
) => {
    const { isLoading } = useGetBridgeTokenList(chainId);

    const [searchValue, setSearchValue] = useState<string>('');

    useEffect(() => { }, [searchValue])

    return (
        <Transition appear show={isVisible}>
            <div className="fixed inset-0 bg-[#000]/[.95]" aria-hidden="true" />
            <Dialog as="div" className="fixed inset-0 top-6 bg-[#2e2e2e] h-[95%] mx-auto w-[95%] md:w-2/6 py-15 py-2 rounded-[10px] z-10" onClose={onClose}>
                <div className='flex justify-between gap-2 w-full px-5 shadow-md flex-col h-full z-20'>
                    <div className="flex flex-col justify-start items-start text-white w-full h-full gap-y-4">
                        <div className="absolute right-5 cursor-pointer" onClick={onClose}>
                            <AiOutlineCloseCircle color='#fff' size={25} />
                        </div>
                        <div className='flex'>
                            <h1 className="text-[25px] text-white font-Syne font-[700]">Select Token To Transfer</h1>
                        </div>
                        <div className="flex items-center justify-center gap-3 w-full border rounded-[5px] p-3 bg-[#0c0c0c]">
                            <AiOutlineSearch size={25} />
                            <input type="text" className='w-full  outline-none h-full bg-transparent' value={searchValue} placeholder='Search' onChange={(e) => setSearchValue(e.target.value)} />
                        </div>
                        <div className="flex flex-col justify-start w-full overflow-y-auto px-1">
                            {!isLoading ? (tokenList?.map((token: any, index: number) => {
                                const isVisible = token?.name?.toLowerCase().startsWith(searchValue.toLowerCase()) || token?.address?.toLowerCase().startsWith(searchValue.toLowerCase());

                                return (
                                    <div className={`flex justify-between gap-5 w-full py-2 rounded-md shadow-md cursor-pointer hover:bg-[#404ebd] ${!isVisible ? 'hidden' : ''}`} key={index} 
                                        onClick={() => onTokenSelected(token)}
                                    >
                                        <div className='flex justify-between w-full gap-2 px-2'>
                                            <div className='flex items-center w-full gap-2'>
                                                <img src={token?.logoUrl} alt={token.name} className='h-[30px] w-[30px] bg-transparent rounded-full' />
                                                <div>
                                                    <p className="text-[15px] text-white font-Syne font-[700]">{token.name}</p>
                                                    <p className="text-[12px] text-[#8e8e8e] font-Syne font-[400]">{token.symbol}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[15px] text-white font-Syne font-[700]">${token.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })) : (
                                <TailSpin color='#fff' height="25px" width="25px" />
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default TokenSelect;