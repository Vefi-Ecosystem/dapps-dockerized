import Head from 'next/head';
import MultiStage from '../../ui/Multisig/MultiStage';

const MultiSig = () => {
  return (
    <>
      <Head>
        <title>VeFi Dapps | MultiSig</title>
      </Head>

      <div className="container">
        <div className="relative w-full py-12 px-4 lg:px-0">
          <MultiStage />
        </div>
      </div>
    </>
  );
};

export default MultiSig;
