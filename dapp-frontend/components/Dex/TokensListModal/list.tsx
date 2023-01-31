import { FiCheckCircle } from 'react-icons/fi';
import { ListingModel } from '../../../api/models/dex';
import { fetchTokenBalanceForConnectedWallet } from '../../../hooks/dex';

type TokensListItemProps = {
  onClick: () => void;
  disabled: boolean;
  model: ListingModel;
};

export default function TokensListItem({ onClick, disabled, model }: TokensListItemProps) {
  const balance = fetchTokenBalanceForConnectedWallet(model.address);
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
        <span className="text-[0.85em]">{balance}</span>
        {disabled && <FiCheckCircle className="text-[0.85em] text-[#105dcf]" />}
      </div>
    </button>
  );
}
