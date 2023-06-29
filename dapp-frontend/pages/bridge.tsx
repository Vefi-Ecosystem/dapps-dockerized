import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ToggleButton from '../ui/Button/ToggleButton';
import { Stargate, Multichain } from '../routes/bridge';

enum Route {
  STARGATE = 'stargate',
  MULTICHAIN = 'multichain'
}

const useBridgeSubRoutes = (routes: Route) => {
  const [component, setComponent] = useState(() => Stargate);

  useEffect(() => {
    switch (routes) {
      case Route.STARGATE:
        setComponent(() => Stargate);
        break;
      case Route.MULTICHAIN:
        setComponent(() => Multichain);
        break;
      default:
        setComponent(() => Stargate);
        break;
    }
  }, [routes]);

  return component;
};

const Bridge = () => {
  const { query, push } = useRouter();
  const RenderedChild = useBridgeSubRoutes(query.tab as Route);
  const route = useMemo(() => (query.tab as Route) || Route.STARGATE, [query.tab]);

  return (
    <>
      <Head>
        <title>Vefi DApps | Bridge</title>
      </Head>
      <div className="flex justify-center items-center py-12 w-full">
        <div className="flex justify-center items-center rounded-[30px] bg-[#fff]/[.11] py-1 px-1">
          <ToggleButton isActive={route === Route.STARGATE} onClick={() => push(`/bridge?tab=${Route.STARGATE}`)}>
            <span>Stargate</span>
          </ToggleButton>
          <ToggleButton isActive={route === Route.MULTICHAIN} onClick={() => push(`/bridge?tab=${Route.MULTICHAIN}`)}>
            <span>Multichain</span>
          </ToggleButton>
        </div>
      </div>
      <div className="flex justify-center items-center mb-16 px-2 w-full">
        <RenderedChild />
      </div>
    </>
  );
};

export default Bridge;
