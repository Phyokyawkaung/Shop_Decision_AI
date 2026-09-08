import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Area,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getDashboardData } from '../services/api';
import { useAppContext } from '../App';

import {
  IconBox,
  IconGrid,
  IconSearch,
  IconSpark,
  IconTrend,
  IconUsers,
} from '../components/Icons';

const PROFIT_TREND = [
  { month: 'Apr', margin: 16.2 },
  { month: 'May', margin: 18.8 },
  { month: 'Jun', margin: 21.4 },
  { month: 'Jul', margin: 19.6 },
  { month: 'Aug', margin: 24.1 },
  { month: 'Sep', margin: 28.4 },
];

function StatCard({
  label,
  value,
  trend,
  icon,
}) {
  return (
    <div className="glass-card flex items-center gap-4 transition hover:border-[#b9a7cb]">

      <IconBox>
        {icon}
      </IconBox>

      <div className="min-w-0 flex-1">

        <p className="text-xs font-semibold uppercase tracking-wide text-[#7d7484]">
          {label}
        </p>

        <p className="text-2xl font-extrabold text-[#27212d]">
          {value}
        </p>

      </div>

      <span className="inline-flex items-center gap-1 rounded-md border border-[#b9d9d3] bg-[#edf8f6] px-2 py-1 text-[11px] font-bold text-[#24776d]">

        <IconTrend />

        {trend}

      </span>

    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[#d8d0df] bg-white px-3 py-2 text-xs shadow-md">

      <p className="text-[#7d7484]">
        {label}
      </p>

      <p className="font-bold text-[#6f4faa]">
        {payload[0].value}% margin
      </p>

    </div>
  );
}

function PeakDot({
  cx,
  cy,
  payload,
  peakMonth,
}) {
  const isPeak =
    payload.month === peakMonth;

  if (cx == null || cy == null) {
    return null;
  }

  if (!isPeak) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#7656b3"
      />
    );
  }

  return (
    <g>

      <circle
        cx={cx}
        cy={cy}
        r={11}
        fill="#d99a32"
        opacity={0.18}
      />

      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#d99a32"
        stroke="#ffffff"
        strokeWidth={2}
      />

    </g>
  );
}

export default function Dashboard() {
  const navigate =
    useNavigate();

  const {
    setSelectedProduct,
    setAnalysisDefaults,
  } = useAppContext();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .finally(() =>
        setLoading(false),
      );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/products?q=${encodeURIComponent(
        searchQuery.trim(),
      )}`,
    );
  };

  const handleViewAnalysis = () => {
    if (!data?.recent_analysis) {
      return;
    }

    const recent =
      data.recent_analysis;

    setSelectedProduct({
      id: recent.product_id,
      product_name:
        recent.product_name,
    });

    setAnalysisDefaults({
      quantity:
        recent.quantity,

      selling_price_mmk:
        recent.selling_price_mmk,

      urgency:
        recent.urgency,
    });

    navigate('/analysis');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="spinner" />
      </div>
    );
  }

  const recent =
    data.recent_analysis;

  const peak =
    PROFIT_TREND.reduce(
      (a, b) =>
        a.margin > b.margin
          ? a
          : b,
    );

  return (
    <div className="space-y-8">

      <section className="rounded-xl border border-[#574266] bg-gradient-to-br from-[#433050] via-[#3a2949] to-[#30213f] p-6 shadow-sm sm:p-7">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-xl">

            <span className="mb-3 inline-flex rounded-md border border-[#9ecfc7] bg-[#edf8f6] px-3 py-1 text-xs font-semibold text-[#24776d]">
              AI-Powered Import Decisions
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Smart sourcing for smarter business
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[#ded6e5]">
              ShopAI helps importers discover Thai products, analyze profitability with AI, and
              monitor inventory — all in one decision support platform.
            </p>

          </div>

          <form
            onSubmit={handleSearch}
            className="w-full max-w-md rounded-xl border border-[#cfc6d6] bg-white p-2 shadow-sm"
          >

            <label
              htmlFor="dashboard-search"
              className="sr-only"
            >
              Search products
            </label>

            <div className="flex items-center gap-2">

              <span className="pl-3">
                <IconSearch />
              </span>

              <input
                id="dashboard-search"
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value,
                  )
                }
                placeholder="Search products (e.g. rice, oil)..."
                className="flex-1 rounded-lg border-0 bg-transparent px-2 py-2.5 text-sm text-[#27212d] placeholder:text-[#9b93a2] focus:outline-none"
              />

              <button
                type="submit"
                className="btn-primary shrink-0"
              >
                Search
              </button>

            </div>

          </form>

        </div>

      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatCard
          label="Products"
          value={
            data.stats.products
          }
          trend="+12% mo."
          icon={<IconGrid />}
        />

        <StatCard
          label="Suppliers"
          value={
            data.stats.suppliers
          }
          trend="+8% mo."
          icon={<IconUsers />}
        />

        <StatCard
          label="Analyses Run"
          value={
            data.stats.analyses
          }
          trend="+18% mo."
          icon={<IconSpark />}
        />

      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">

        <div className="glass-card lg:col-span-3">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h3 className="text-lg font-bold text-[#27212d]">
                Profit Margin Trends
              </h3>

              <p className="text-xs text-[#817989]">
                Trailing 6 months · peak {peak.month}
              </p>

            </div>

            <span className="rounded-md border border-[#e4c38f] bg-[#fff7e8] px-3 py-1 text-xs font-bold text-[#a96812]">
              Peak {peak.margin}%
            </span>

          </div>

          <div className="h-64 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <ComposedChart
                data={PROFIT_TREND}
                margin={{
                  top: 12,
                  right: 8,
                  left: -16,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="marginFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#7656b3"
                      stopOpacity={0.22}
                    />

                    <stop
                      offset="100%"
                      stopColor="#7656b3"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#e5dfe9"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  stroke="#817989"
                  fontSize={12}
                  tickLine={false}
                />

                <YAxis
                  stroke="#817989"
                  fontSize={12}
                  tickLine={false}
                  unit="%"
                />

                <Tooltip
                  content={
                    <ChartTooltip />
                  }
                />

                <Area
                  type="monotone"
                  dataKey="margin"
                  stroke="none"
                  fill="url(#marginFill)"
                />

                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke="#7656b3"
                  strokeWidth={2.5}
                  dot={
                    <PeakDot
                      peakMonth={
                        peak.month
                      }
                    />
                  }
                  activeDot={{
                    r: 7,
                    fill: '#d99a32',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                />

              </ComposedChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="rounded-xl border border-[#b9a7cb] bg-[#f2edf6] p-6 shadow-sm lg:col-span-2">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6f4faa]">
            Top AI Decision
          </p>

          <h4 className="mt-3 text-xl font-extrabold text-[#27212d]">
            {recent.product_name}
          </h4>

          <div className="mt-3 space-y-1 text-sm text-[#706777]">

            <p>
              Supplier{' '}

              <span className="font-semibold text-[#3e3744]">
                {recent.supplier_name}
              </span>
            </p>

            <p>
              Shipping{' '}

              <span className="font-semibold text-[#3e3744]">
                {recent.shipping_method}
              </span>
            </p>

          </div>

          <div className="mt-5 rounded-lg border border-[#e4c38f] bg-[#fff7e8] px-4 py-3">

            <p className="text-xs font-semibold uppercase tracking-wide text-[#a96812]">
              Profit Margin
            </p>

            <p className="text-3xl font-extrabold text-[#a96812]">
              {recent.profit_margin}%
            </p>

          </div>

          <button
            type="button"
            onClick={
              handleViewAnalysis
            }
            className="btn-primary mt-5 w-full"
          >
            View Analysis
          </button>

        </div>

      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {[
          {
            to: '/products',
            title:
              'Product Discovery',
            desc:
              'Search ThaiTrade products and compare suppliers.',
          },

          {
            to: '/analysis',
            title:
              'AI Analysis',
            desc:
              'Run profitability analysis with Prolog-powered AI.',
          },

          {
            to: '/inventory',
            title:
              'Inventory Status',
            desc:
              'Monitor stock levels and reorder points.',
          },
        ].map((item) => (

          <Link
            key={item.to}
            to={item.to}
            className="glass-card group transition hover:border-[#b9a7cb]"
          >

            <h4 className="font-bold text-[#6f4faa] group-hover:text-[#563b8d]">
              {item.title}
            </h4>

            <p className="mt-1 text-sm text-[#7d7484]">
              {item.desc}
            </p>

          </Link>

        ))}

      </section>

    </div>
  );
}