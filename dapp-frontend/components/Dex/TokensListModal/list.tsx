import { FiCheckCircle } from 'react-icons/fi';
import { ListingModel } from '../../../api/models/dex';
import { AddressZero } from '@ethersproject/constants';
import { useEtherBalance, useTokenBalance } from '../../../hooks/wallet';
import { RotatingLines } from 'react-loader-spinner';

type TokensListItemProps = {
  onClick: () => void;
  disabled: boolean;
  model: ListingModel;
};

export default function TokensListItem({ onClick, disabled, model }: TokensListItemProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { balance, isLoading } = model.address === AddressZero ? useEtherBalance() : useTokenBalance(model.address);
  return (
    <button disabled={disabled} onClick={onClick} className="flex justify-between items-start px-2 w-full overflow-auto font-Syne">
      <div className="flex justify-center items-center gap-2">
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img src={model.logoURI} alt={model.symbol} />
          </div>
        </div>
        <span className="font-[400] text-[0.8em]">{model.name}</span>
      </div>
      <div className="flex justify-center items-center gap-2">
        {isLoading ? <RotatingLines width="10" strokeColor="#fff" /> : <span className="text-[0.85em]">{balance}</span>}
        {disabled && <FiCheckCircle className="text-[0.85em] text-[#105dcf]" />}
      </div>
    </button>
  );
}
