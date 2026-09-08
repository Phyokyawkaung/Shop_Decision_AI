import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  searchProducts,
} from '../services/api';

import {
  useAppContext,
} from '../App';

import {
  IconSearch,
} from '../components/Icons';

function ProductCard({
  product,
  onAnalyze,
}) {
  return (
    <article className="glass-card flex flex-col transition hover:border-[#b9a7cb]">

      <div className="mb-4 flex items-start justify-between gap-2">

        <div>

          <h3 className="text-lg font-bold text-[#27212d]">
            {product.product_name}
          </h3>

          <p className="text-sm text-[#756d7c]">
            {product.supplier_name}
          </p>

        </div>

        <span className="shrink-0 rounded-md border border-[#d7cce1] bg-[#eee8f5] px-3 py-1 text-xs font-semibold text-[#6f4faa]">
          {product.category}
        </span>

      </div>

      <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">

        <div>

          <dt className="text-xs uppercase tracking-wide text-[#817989]">
            Price
          </dt>

          <dd className="text-lg font-extrabold text-[#6f4faa]">
            {product.price_thb} THB
          </dd>

        </div>

        <div>

          <dt className="text-xs uppercase tracking-wide text-[#817989]">
            Weight
          </dt>

          <dd className="font-semibold text-[#3e3744]">
            {product.weight_kg} kg
          </dd>

        </div>

        <div>

          <dt className="text-xs uppercase tracking-wide text-[#817989]">
            MOQ
          </dt>

          <dd className="font-semibold text-[#3e3744]">
            {product.moq}
          </dd>

        </div>

        <div>

          <dt className="text-xs uppercase tracking-wide text-[#817989]">
            Rating
          </dt>

          <dd className="font-semibold text-[#b97821]">

            {'★'.repeat(
              Math.round(
                product.rating,
              ),
            )}{' '}

            <span className="text-[#625a68]">
              {product.rating}
            </span>

          </dd>

        </div>

        <div className="col-span-2">

          <dt className="text-xs uppercase tracking-wide text-[#817989]">
            Trust Score
          </dt>

          <dd>

            <div className="mt-1 flex items-center gap-2">

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8e1ec]">

                <div
                  className="h-full rounded-full bg-[#2f8f83]"
                  style={{
                    width: `${product.trust_score}%`,
                  }}
                />

              </div>

              <span className="text-sm font-bold text-[#24776d]">
                {product.trust_score}
              </span>

            </div>

          </dd>

        </div>

      </dl>

      <button
        type="button"
        onClick={() =>
          onAnalyze(product)
        }
        className="btn-gradient mt-auto"
      >
        Analyze with AI →
      </button>

    </article>
  );
}

export default function Products() {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const {
    setSelectedProduct,
  } = useAppContext();

  const [query, setQuery] =
    useState(
      searchParams.get('q') ||
        '',
    );

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);

  const runSearch =
    useCallback(
      async (q) => {
        setLoading(true);
        setSearched(true);

        try {
          const data =
            await searchProducts(q);

          setResults(data);
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    const initial =
      searchParams.get('q') ||
      '';

    setQuery(initial);

    runSearch(initial);
  }, [
    searchParams,
    runSearch,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(
      `/products?q=${encodeURIComponent(
        query.trim(),
      )}`,
      {
        replace: true,
      },
    );

    runSearch(query);
  };

  const handleAnalyze = (
    product,
  ) => {
    setSelectedProduct(
      product,
    );

    navigate('/analysis');
  };

  return (
    <div className="space-y-6">

      <div>

       <h2 className="text-2xl font-extrabold text-white">
          Product Discovery
        </h2>

        <p className="mt-1 text-[#d0c5d8]">
          Search ThaiTrade products and send any item directly to AI Analysis.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card"
      >

        <div className="mb-3 flex items-center justify-between gap-3">

          <label
            htmlFor="product-search"
            className="text-sm font-semibold text-[#4a424f]"
          >
            Search Products
          </label>

          {searched &&
            !loading && (

              <span className="rounded-md border border-[#b9d9d3] bg-[#edf8f6] px-3 py-1 text-xs font-bold text-[#24776d]">

                {results.length} result
                {results.length !== 1
                  ? 's'
                  : ''}

              </span>

            )}

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <IconSearch />
            </span>

            <input
              id="product-search"
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value,
                )
              }
              placeholder='Try "rice", "oil", or "silver"...'
              className="field-input pl-10"
            />

          </div>

          <button
            type="submit"
            className="btn-primary shrink-0"
            disabled={loading}
          >
            {loading
              ? 'Searching...'
              : 'Search'}
          </button>

        </div>

      </form>

      {loading && (

        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>

      )}

      {!loading &&
        searched &&
        results.length === 0 && (

          <div className="rounded-xl border border-[#e4c38f] bg-[#fff7e8] px-6 py-8 text-center">

            <p className="font-semibold text-[#a96812]">
              No products found
            </p>

            <p className="mt-1 text-sm text-[#9a6a2f]">
              Try a different keyword like &quot;rice&quot; or &quot;oil&quot;.
            </p>

          </div>

        )}

      {!loading &&
        results.length > 0 && (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {results.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  onAnalyze={
                    handleAnalyze
                  }
                />

              ),
            )}

          </div>

        )}

    </div>
  );
}