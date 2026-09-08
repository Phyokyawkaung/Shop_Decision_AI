import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  analyzeProduct,
  getAllProducts,
} from '../services/api';

import {
  useAppContext,
} from '../App';

function formatNumber(n) {
  return Number(n).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    },
  );
}

function CostRow({
  label,
  value,
  highlight,
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-4 py-3 ${
        highlight
          ? 'border border-[#e4c38f] bg-[#fff7e8]'
          : 'border border-[#e1dae6] bg-[#faf8fb]'
      }`}
    >

      <span className="text-sm font-medium text-[#756d7c]">
        {label}
      </span>

      <span
        className={`text-sm font-bold ${
          highlight
            ? 'text-[#a96812]'
            : 'text-[#3e3744]'
        }`}
      >
        {value}
      </span>

    </div>
  );
}

export default function Analysis() {
  const {
    selectedProduct,
    setSelectedProduct,
    analysisDefaults,
    setAnalysisDefaults,
  } = useAppContext();

  const [products, setProducts] =
    useState([]);

  const [form, setForm] =
    useState({
      product_id:
        selectedProduct?.id ||
        '',

      quantity:
        analysisDefaults.quantity,

      selling_price_mmk:
        analysisDefaults.selling_price_mmk,

      urgency:
        analysisDefaults.urgency,
    });

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    getAllProducts().then(
      setProducts,
    );
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setForm((prev) => ({
        ...prev,

        product_id:
          selectedProduct.id,

        quantity:
          analysisDefaults.quantity,

        selling_price_mmk:
          analysisDefaults.selling_price_mmk,

        urgency:
          analysisDefaults.urgency,
      }));
    }
  }, [
    selectedProduct,
    analysisDefaults,
  ]);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === 'product_id'
    ) {
      const product =
        products.find(
          (p) =>
            p.id ===
            Number(value),
        );

      if (product) {
        setSelectedProduct(
          product,
        );
      }
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError('');
      setLoading(true);
      setResult(null);

      try {
        const data =
          await analyzeProduct({
            product_id:
              Number(
                form.product_id,
              ),

            quantity:
              form.quantity,

            selling_price_mmk:
              form.selling_price_mmk,

            urgency:
              form.urgency,
          });

        setResult(data);

        setAnalysisDefaults({
          quantity:
            Number(
              form.quantity,
            ),

          selling_price_mmk:
            Number(
              form.selling_price_mmk,
            ),

          urgency:
            form.urgency,
        });
      } catch {
        setError(
          'Analysis failed. Please check your inputs and try again.',
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-extrabold text-white">
          AI Analysis
        </h2>

        <p className="mt-1 text-[#d0c5d8]">
          Enter business parameters to receive AI-powered import recommendations.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        <form
          onSubmit={
            handleSubmit
          }
          className="glass-card h-fit lg:col-span-4"
        >

          <h3 className="mb-5 text-lg font-bold text-[#27212d]">
            Analysis Parameters
          </h3>

          <div className="space-y-4">

            <div>

              <label
                htmlFor="product_id"
                className="mb-1 block text-sm font-semibold text-[#4a424f]"
              >
                Product
              </label>

              <select
                id="product_id"
                name="product_id"
                value={
                  form.product_id
                }
                onChange={
                  handleChange
                }
                required
                className="field-input"
              >

                <option value="">
                  Select a product...
                </option>

                {products.map(
                  (p) => (

                    <option
                      key={p.id}
                      value={p.id}
                    >
                      {p.product_name} — {p.supplier_name}
                    </option>

                  ),
                )}

              </select>

              {!selectedProduct && (

                <p className="mt-1 text-xs text-[#817989]">

                  Or{' '}

                  <Link
                    to="/products"
                    className="font-semibold text-[#6f4faa] hover:underline"
                  >
                    discover products
                  </Link>{' '}

                  and click Analyze.

                </p>

              )}

            </div>

            <div>

              <label
                htmlFor="quantity"
                className="mb-1 block text-sm font-semibold text-[#4a424f]"
              >
                Quantity
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={
                  form.quantity
                }
                onChange={
                  handleChange
                }
                required
                className="field-input"
              />

            </div>

            <div>

              <label
                htmlFor="selling_price_mmk"
                className="mb-1 block text-sm font-semibold text-[#4a424f]"
              >
                Expected Selling Price (MMK)
              </label>

              <input
                id="selling_price_mmk"
                name="selling_price_mmk"
                type="number"
                min="1"
                step="0.01"
                value={
                  form.selling_price_mmk
                }
                onChange={
                  handleChange
                }
                required
                className="field-input"
              />

            </div>

            <div>

              <label
                htmlFor="urgency"
                className="mb-1 block text-sm font-semibold text-[#4a424f]"
              >
                Urgency
              </label>

              <select
                id="urgency"
                name="urgency"
                value={
                  form.urgency
                }
                onChange={
                  handleChange
                }
                className="field-input"
              >

                <option value="normal">
                  Normal
                </option>

                <option value="urgent">
                  Urgent
                </option>

              </select>

            </div>

          </div>

          <button
            type="submit"
            className="btn-gradient mt-6"
            disabled={
              loading ||
              !form.product_id
            }
          >
            {loading
              ? 'Analyzing...'
              : 'Run AI Analysis'}
          </button>

          {error && (

            <p className="mt-3 rounded-lg border border-[#e4aaaa] bg-[#fff0f0] px-4 py-3 text-sm font-medium text-[#a33a3a]">
              {error}
            </p>

          )}

        </form>

        <div className="space-y-6 lg:col-span-8">

          {loading && (

            <div className="glass-card flex flex-col items-center gap-3 py-16">

              <div className="spinner" />

              <p className="text-sm font-medium text-[#6f4faa]">
                AI engine processing...
              </p>

            </div>

          )}

          {!loading &&
            !result && (

              <div className="glass-card flex min-h-[280px] items-center justify-center text-center">

  <div className="max-w-md">

    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#eee8f5] text-2xl text-[#6f4faa]">
      ✦
    </div>

    <p className="font-semibold text-[#4a424f]">
      Configure parameters on the left and run analysis to see the AI recommendation.
    </p>

  </div>

</div>

            )}

          {result &&
            !loading && (
              <>

                <section className="rounded-xl border border-[#b9a7cb] bg-[#f2edf6] p-6 shadow-sm sm:p-8">

                  <div className="mb-4 flex flex-wrap items-center gap-2">

                    <span className="rounded-md border border-[#d7cce1] bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#6f4faa]">
                      AI Recommendation
                    </span>

                    <span className="rounded-md border border-[#e4c38f] bg-[#fff7e8] px-3 py-1 text-xs font-bold text-[#a96812]">
                      Score: {result.recommendation.ai_score}
                    </span>

                  </div>

                  <h3 className="text-2xl font-extrabold text-[#27212d]">
                    {result.product.product_name}
                  </h3>

                  <p className="mt-1 text-sm text-[#706777]">
                    {result.recommendation.supplier} · {result.recommendation.shipping}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-lg border border-[#e4c38f] bg-[#fff7e8] p-5">

                      <p className="text-xs font-semibold uppercase tracking-wide text-[#a96812]">
                        Net Profit Margin
                      </p>

                      <p className="mt-1 text-4xl font-extrabold text-[#a96812]">
                        {result.recommendation.profit_margin}%
                      </p>

                    </div>

                    <div className="rounded-lg border border-[#a9d6cf] bg-[#edf8f6] p-5">

                      <p className="text-xs font-semibold uppercase tracking-wide text-[#24776d]">
                        Estimated Profit
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-[#27212d]">

                        {formatNumber(
                          result.recommendation.estimated_profit_mmk,
                        )}{' '}

                        <span className="text-base text-[#24776d]">
                          MMK
                        </span>

                      </p>

                    </div>

                  </div>

                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                  <section className="glass-card">

                    <h3 className="mb-4 text-lg font-bold text-[#27212d]">
                      Cost & Revenue
                    </h3>

                    <div className="space-y-3">

                      <CostRow
                        label="Product Cost (THB)"
                        value={`${formatNumber(
                          result.cost_analysis.product_cost_thb,
                        )} THB`}
                      />

                      <CostRow
                        label="Shipping Cost (THB)"
                        value={`${formatNumber(
                          result.cost_analysis.shipping_cost_thb,
                        )} THB`}
                      />

                      <CostRow
                        label="Exchange Rate"
                        value={`1 THB = ${result.cost_analysis.exchange_rate} MMK`}
                      />

                      <CostRow
                        label="Total Cost (MMK)"
                        value={`${formatNumber(
                          result.cost_analysis.total_cost_mmk,
                        )} MMK`}
                      />

                      <CostRow
                        label="Expected Revenue (MMK)"
                        value={`${formatNumber(
                          result.cost_analysis.expected_revenue_mmk,
                        )} MMK`}
                      />

                      <CostRow
                        label="Net Profit (MMK)"
                        value={`${formatNumber(
                          result.cost_analysis.net_profit_mmk,
                        )} MMK`}
                        highlight
                      />

                    </div>

                  </section>

                  <section className="glass-card">

                    <h3 className="mb-4 text-lg font-bold text-[#27212d]">
                      AI Reasoning
                    </h3>

                    <ul className="space-y-2">

                      {result.reasons.map(
                        (reason) => (

                          <li
                            key={reason}
                            className="flex items-start gap-3 rounded-lg border border-[#e1dae6] bg-[#faf8fb] px-4 py-3 text-sm text-[#514957]"
                          >

                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e2f2ef] text-xs font-bold text-[#24776d]">
                              ✓
                            </span>

                            {reason}

                          </li>

                        ),
                      )}

                    </ul>

                  </section>

                </div>

                <section>

                  {result.inventory ? (

                    <div className="glass-card border-l-4 border-l-[#2f8f83]">

                      <h3 className="mb-3 text-lg font-bold text-[#27212d]">
                        Inventory Status
                      </h3>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                        <div>

                          <p className="text-xs font-semibold uppercase text-[#817989]">
                            Current Stock
                          </p>

                          <p className="text-xl font-bold text-[#27212d]">
                            {result.inventory.current_stock}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs font-semibold uppercase text-[#817989]">
                            Avg. Daily Sales
                          </p>

                          <p className="text-xl font-bold text-[#27212d]">
                            {result.inventory.average_daily_sales}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs font-semibold uppercase text-[#817989]">
                            Reorder Point
                          </p>

                          <p className="text-xl font-bold text-[#27212d]">
                            {result.inventory.reorder_point}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs font-semibold uppercase text-[#817989]">
                            Decision
                          </p>

                          {result.inventory.status ===
                          'REORDER' ? (

                            <span className="badge-reorder mt-1">
                              REORDER
                            </span>

                          ) : (

                            <span className="badge-ok mt-1">
                              OK
                            </span>

                          )}

                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="rounded-xl border border-[#e4c38f] bg-[#fff7e8] px-6 py-4">

                      <p className="font-semibold text-[#a96812]">
                        Inventory data unavailable — decision supported without historical sales
                      </p>

                      <p className="mt-1 text-sm text-[#8e6635]">
                        The AI recommendation above is based on supplier, cost, and profitability data
                        only.
                      </p>

                    </div>

                  )}

                </section>

              </>
            )}

        </div>

      </div>

    </div>
  );
}