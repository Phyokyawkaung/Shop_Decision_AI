export function IconBox({ children }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#d7cce1] bg-[#eee8f5] text-[#6f4faa]">
      {children}
    </div>
  );
}

export function IconGrid() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h6v6H4V6zm10 0h6v6h-6V6zM4 16h6v6H4v-6zm10 0h6v6h-6v-6z"
      />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
      />

      <circle
        cx="9"
        cy="7"
        r="3"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  );
}

export function IconSpark() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
      />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg
      className="h-4 w-4 text-[#817989]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path
        strokeLinecap="round"
        d="M20 20l-3-3"
      />
    </svg>
  );
}

export function IconTrend() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l6-6 4 4 6-8"
      />
    </svg>
  );
}