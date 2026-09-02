import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, ShoppingCart, Store, UserPlus } from 'lucide-react';
import { useApp } from '../store';
import { countCartItems, getConsolePath, isStaffRole } from '../services';

export default function Navbar() {
  const { session, cart, signOut } = useApp();
  const navigate = useNavigate();
  const cartCount = useMemo(() => countCartItems(cart), [cart]);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav__inner">
        <Link to="/" className="brand" aria-label="SJCM Store home">
          <span className="brand__mark">SJ</span>
          <span className="brand__copy">
            <span className="brand__name">SJCM Store</span>
            <span className="brand__tagline">Campus merchandise pickup</span>
          </span>
        </Link>
        <div className="nav-actions">
          <Link to="/catalog" className="nav-action" aria-label="Browse catalog">
            <Store className="react-icon" aria-hidden="true" />
            <span className="nav-action__label">Catalog</span>
          </Link>
          <Link to="/cart" className="nav-action" aria-label="Open shopping cart">
            <ShoppingCart className="react-icon" aria-hidden="true" />
            <span className="nav-action__label">Cart</span>
            {cartCount > 0 && (
              <span className="nav-cart-count" aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            )}
          </Link>
          {session ? (
            <>
              <Link
                to={getConsolePath(session.role)}
                className="nav-action"
                aria-label={`Open ${isStaffRole(session.role) ? 'console' : 'dashboard'}`}
              >
                <LayoutDashboard className="react-icon" aria-hidden="true" />
                <span className="nav-action__label">
                  {isStaffRole(session.role) ? 'Console' : 'Dashboard'}
                </span>
              </Link>
              <span className="nav-session" title={`Signed in as ${session.name}`}>
                {session.name}
              </span>
              <button
                type="button"
                className="nav-action nav-action--danger"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="react-icon" aria-hidden="true" />
                <span className="nav-action__label">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-action" aria-label="Sign in">
                <LogIn className="react-icon" aria-hidden="true" />
                <span className="nav-action__label">Sign in</span>
              </Link>
              <Link to="/register" className="nav-action nav-action--accent" aria-label="Create an account">
                <UserPlus className="react-icon" aria-hidden="true" />
                <span className="nav-action__label">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
