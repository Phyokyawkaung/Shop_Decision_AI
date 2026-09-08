import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Product Discovery' },
  { to: '/analysis', label: 'AI Analysis' },
  { to: '/inventory', label: 'Inventory Status' },
];

function NavItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `rounded-lg px-4 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-[#7656b3] text-white'
            : 'text-[#ded6e5] hover:bg-[#493759] hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#493759] bg-[#30233f]">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">

            <img
              src="https://png.pngtree.com/png-clipart/20220605/original/pngtree-shop-logo-design-with-a-handshake-in-bag-png-image_7961653.png"
              alt="ShopAI Logo"
              className="h-full w-full object-contain"
            />

          </div>

          <div>

            <h1 className="text-xl font-bold tracking-tight text-white">
              ShopAI
            </h1>

            <p className="hidden text-xs text-[#c5b9cd] sm:block">
              AI Import & Business Decision Support
            </p>

          </div>

        </div>

        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">

          {navItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
            />
          ))}

        </nav>

      </div>

    </header>
  );
}