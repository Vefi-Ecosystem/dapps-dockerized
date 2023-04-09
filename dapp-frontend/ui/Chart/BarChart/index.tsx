import type { Dispatch, SetStateAction } from 'react';
import millify from 'millify';
import { BarChart as BChart, XAxis, YAxis, Bar, Tooltip } from 'recharts';

type BarChartProps = {
  width?: number;
  height?: number;
  data: Array<any>;
  xAxisDataKey: string;
  barDataKey: string;
  fill: string;
  tooltiped?: boolean;
  setHoverValue?: Dispatch<SetStateAction<number | undefined>>;
  setHoverDate?: Dispatch<SetStateAction<string | undefined>>;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  xAxisOrientation?: 'top' | 'bottom';
  yAxisOrientation?: 'left' | 'right';
};

export default function BarChart({
  width,
  height,
  data,
  xAxisDataKey,
  barDataKey,
  fill,
  tooltiped,
  setHoverValue,
  setHoverDate,
  hideXAxis,
  hideYAxis,
  xAxisOrientation,
  yAxisOrientation
}: BarChartProps) {
  return (
    <BChart
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
        minTickGap={1}
        fontSize={12}
        tickCount={12}
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
            if (setHoverValue) setHoverValue(props.payload?.[barDataKey]);
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
      <Bar
        dataKey={barDataKey}
        fill="url(#gradient)"
        shape={(props) => (
          <g>
            <rect x={props.x} y={props.y} fill={fill} width={props.width} height={props.height} rx="2" />
          </g>
        )}
      />
    </BChart>
  );
}
