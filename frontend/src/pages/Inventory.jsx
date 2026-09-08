import {
  useEffect,
  useState,
} from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getInventoryStatus,
} from '../services/api';

function StatusBadge({
  status,
}) {
  if (
    status === 'REORDER'
  ) {
    return (
      <span className="badge-reorder">
        {status}
      </span>
    );
  }

  return (
    <span className="badge-ok">
      {status}
    </span>
  );
}

function DecisionBadge({
  decision,
}) {
  const styles = {
    IMPORT:
      'border-[#a9d6cf] bg-[#edf8f6] text-[#24776d]',

    REVIEW:
      'border-[#e4c38f] bg-[#fff7e8] text-[#a96812]',

    SKIP:
      'border-[#d7d0dc] bg-[#f4f1f5] text-[#706777]',
  };

  return (
    <span
      className={`inline-flex rounded-md border px-3 py-1 text-xs font-bold uppercase ${
        styles[decision] ||
        styles.REVIEW
      }`}
    >
      {decision}
    </span>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#d8d0df] bg-white px-3 py-2 text-xs shadow-md">

      <p className="mb-1 font-semibold text-[#3e3744]">
        {label}
      </p>

      {payload.map(
        (entry) => (

          <p
            key={
              entry.dataKey
            }
            style={{
              color:
                entry.color,
            }}
          >
            {entry.name}: {entry.value}
          </p>

        ),
      )}

    </div>
  );
}

export default function Inventory() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getInventoryStatus()
      .then(setData)
      .finally(() =>
        setLoading(false),
      );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="spinner" />
      </div>
    );
  }

  const chartData =
    data.inventory.map(
      (item) => ({
        name: (
          item.product_display ||
          item.product_name
        ).replace(
          'Sterling ',
          '',
        ),

        stock:
          item.current_stock,

        reorder:
          item.reorder_point,
      }),
    );

  return (
    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-extrabold text-white">
          Inventory Status
        </h2>

        <p className="mt-1 text-[#d0c5d8]">
          Monitor stock levels, sales rates, and recent AI import decisions.
        </p>

      </div>

      <section className="glass-card overflow-hidden p-0">

        <div className="border-b border-[#e1dae6] bg-[#f8f5fa] px-6 py-4">

          <h3 className="text-lg font-bold text-[#27212d]">
            Stock Overview
          </h3>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[640px] text-left text-sm">

            <thead>

              <tr className="border-b border-[#e1dae6] bg-[#eee9f1] text-xs font-semibold uppercase tracking-wide text-[#756d7c]">

                <th className="px-6 py-3">
                  Product
                </th>

                <th className="px-6 py-3">
                  Stock
                </th>

                <th className="px-6 py-3">
                  Sales Rate
                </th>

                <th className="px-6 py-3">
                  Reorder Point
                </th>

                <th className="px-6 py-3">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#e7e1eb] bg-white">

              {data.inventory.map(
                (item) => (

                  <tr
                    key={item.id}
                    className="transition hover:bg-[#faf8fb]"
                  >

                    <td className="px-6 py-4 font-semibold text-[#27212d]">

                      {item.product_display ||
                        item.product_name}

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`font-bold ${
                          item.current_stock <=
                          item.reorder_point
                            ? 'text-[#b97821]'
                            : 'text-[#24776d]'
                        }`}
                      >
                        {item.current_stock}
                      </span>

                      <span className="text-[#817989]">
                        {' '} / safety {item.safety_stock}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-[#514957]">
                      {item.average_daily_sales} / day
                    </td>

                    <td className="px-6 py-4 text-[#514957]">
                      {item.reorder_point}
                    </td>

                    <td className="px-6 py-4">

                      <StatusBadge
                        status={
                          item.status
                        }
                      />

                    </td>

                  </tr>

                ),
              )}

            </tbody>

          </table>

        </div>

      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {data.inventory
          .filter(
            (i) =>
              i.status ===
              'REORDER',
          )
          .map((item) => (

            <div
              key={item.id}
              className="rounded-xl border border-[#e4c38f] bg-[#fff7e8] px-5 py-4"
            >

              <p className="text-xs font-bold uppercase tracking-wide text-[#a96812]">
                Reorder Alert
              </p>

              <p className="mt-1 font-bold text-[#744c16]">
                {item.product_display ||
                  item.product_name}
              </p>

              <p className="mt-1 text-sm text-[#8e6635]">

                Stock ({item.current_stock}) is at or below reorder point ({item.reorder_point}).

              </p>

            </div>

          ))}

      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">

        <div className="glass-card lg:col-span-2">

          <h3 className="mb-4 text-lg font-bold text-[#27212d]">
            Stock vs Reorder
          </h3>

          <div className="h-72 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  chartData
                }
                margin={{
                  top: 8,
                  right: 8,
                  left: -16,
                  bottom: 32,
                }}
              >

                <CartesianGrid
                  stroke="#e5dfe9"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#817989"
                  fontSize={10}
                  interval={0}
                  angle={-18}
                />

                <YAxis
                  stroke="#817989"
                  fontSize={12}
                />

                <Tooltip
                  content={
                    <ChartTooltip />
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: '#756d7c',
                  }}
                />

                <Bar
                  dataKey="stock"
                  name="Current Stock"
                  fill="#2f8f83"
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />

                <Bar
                  dataKey="reorder"
                  name="Reorder Point"
                  fill="#d99a32"
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="glass-card overflow-hidden p-0 lg:col-span-3">

          <div className="border-b border-[#e1dae6] bg-[#f8f5fa] px-6 py-4">

            <h3 className="text-lg font-bold text-[#27212d]">
              Recent AI Decision Log
            </h3>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[720px] text-left text-sm">

              <thead>

                <tr className="border-b border-[#e1dae6] bg-[#eee9f1] text-xs font-semibold uppercase tracking-wide text-[#756d7c]">

                  <th className="px-4 py-3">
                    Date
                  </th>

                  <th className="px-4 py-3">
                    Product
                  </th>

                  <th className="px-4 py-3">
                    Supplier
                  </th>

                  <th className="px-4 py-3">
                    Qty
                  </th>

                  <th className="px-4 py-3">
                    Margin
                  </th>

                  <th className="px-4 py-3">
                    Score
                  </th>

                  <th className="px-4 py-3">
                    Decision
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#e7e1eb] bg-white">

                {data.decision_log.map(
                  (log) => (

                    <tr
                      key={log.id}
                      className="transition hover:bg-[#faf8fb]"
                    >

                      <td className="whitespace-nowrap px-4 py-3 text-[#817989]">
                        {log.date}
                      </td>

                      <td className="px-4 py-3 font-semibold text-[#27212d]">
                        {log.product_name}
                      </td>

                      <td className="px-4 py-3 text-[#514957]">
                        {log.supplier}
                      </td>

                      <td className="px-4 py-3 text-[#514957]">
                        {log.quantity}
                      </td>

                      <td className="px-4 py-3">

                        <span className="rounded-md border border-[#e4c38f] bg-[#fff7e8] px-2 py-1 font-bold text-[#a96812]">
                          {log.profit_margin}%
                        </span>

                      </td>

                      <td className="px-4 py-3 font-semibold text-[#6f4faa]">
                        {log.ai_score}
                      </td>

                      <td className="px-4 py-3">

                        <DecisionBadge
                          decision={
                            log.decision
                          }
                        />

                      </td>

                    </tr>

                  ),
                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  );
}