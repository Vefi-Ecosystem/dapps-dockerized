import type { Dispatch, SetStateAction } from 'react';
import millify from 'millify';
import { AreaChart as AChart, XAxis, YAxis, Area, Tooltip } from 'recharts';

type AreaChartProps = {
  width?: number;
  height?: number;
  data: Array<any>;
  xAxisDataKey: string;
  areaDataKey: string;
  fill: string;
  stroke: string;
  tooltiped?: boolean;
  setHoverValue?: Dispatch<SetStateAction<number | undefined>>;
  setHoverDate?: Dispatch<SetStateAction<string | undefined>>;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  xAxisOrientation?: 'top' | 'bottom';
  yAxisOrientation?: 'left' | 'right';
};

export default function AreaChart({
  width,
  height,
  data,
  xAxisDataKey,
  areaDataKey,
  fill,
  stroke,
  tooltiped,
  setHoverValue,
  setHoverDate,
  hideXAxis,
  hideYAxis,
  xAxisOrientation,
  yAxisOrientation
}: AreaChartProps) {
  return (
    <AChart
      data={data}
      width={width}
      height={height}
      onMouseLeave={() => {
        if (setHoverValue) setHoverValue(undefined);
        if (setHoverDate) setHoverDate(undefined);
      }}
    >
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={fill} stopOpacity={0.8} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis
        hide={hideXAxis}
        orientation={xAxisOrientation}
        dataKey={xAxisDataKey}
        axisLine={false}
        tickLine={false}
        tickFormatter={(val) => (val.toLocaleDateString ? val.toLocaleDateString(undefined, { month: '2-digit' }) : '')}
        minTickGap={30}
        fontSize={12}
      />
      <YAxis
        hide={hideYAxis}
        orientation={yAxisOrientation}
        axisLine={false}
        tickLine={false}
        tickFormatter={(val) => `${millify(val)}`}
        fontSize={12}
      />
      {tooltiped && (
        <Tooltip
          contentStyle={{ display: 'none' }}
          formatter={(tooltipValue, name, props) => {
            if (setHoverValue) setHoverValue(props.payload?.[areaDataKey]);
            if (setHoverDate)
              setHoverDate(
                new Date(props.payload?.[xAxisDataKey]).toLocaleDateString(undefined, {
                  year: 'numeric',
                  day: 'numeric',
                  month: 'short'
                })
              );

            return null as any;
          }}
        />
      )}
      <Area type="monotone" dataKey={areaDataKey} fill="url(#gradient)" strokeWidth={2} stroke={stroke} />
    </AChart>
  );
}
