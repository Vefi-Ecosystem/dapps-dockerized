import { HTMLAttributes } from 'react';

export const THead = ({ children }: any) => (
  <div className="table-header-group font-Syne text-[#aaaaaa] font-[700] text-[0.8em] lg:text-[1em] py-2 border-b border-[#353535] w-full">
    {children}
  </div>
);

export const TRow = ({ children }: any) => <div className="table-row border-b border-[#353535] w-full">{children}</div>;

export const TCell = ({ children, className }: HTMLAttributes<HTMLDivElement>) => (
  <div className={'table-cell '.concat(className as string)}>{children}</div>
);

export const TBody = ({ children }: any) => <div className="table-row-group w-full">{children}</div>;

export const Table = ({ children }: any) => (
  <div className="table w-full overflow-auto hidden-scrollbar border-collapse border-spacing-y-[1em] border-spacing-x-0">{children}</div>
);
