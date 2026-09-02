import { Link } from 'react-router-dom';
import { ArrowUpRight, Badge, LogIn, PackageX, Shirt, Store } from 'lucide-react';
import { useProducts } from '../store';
import { getStockBadge } from '../services';

export default function HomePage() {
  const products = useProducts();

  return (
    <>
      <main className="page-shell hero-shell">
        <div className="hero-copy">
          <p className="queue-badge">Virtual queue active</p>
          <h1 id="hero-title" className="hero-title">
            Reserve today. <span>Pick up on campus.</span>
          </h1>
          <p className="hero-lede">
            Check live stock for uniforms, organization apparel, and ID laces. Reserve what you need
            online, then collect it from the SJCM supply office without waiting in line.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="button button--primary">
              <Store className="react-icon" aria-hidden="true" />
              <span>Browse catalog</span>
            </Link>
            <Link to="/login" className="button button--secondary">
              <LogIn className="react-icon" aria-hidden="true" />
              <span>Sign in to reserve</span>
            </Link>
          </div>
        </div>

        <aside className="stock-panel" aria-labelledby="stock-title">
          <div className="stock-panel__header">
            <div>
              <h2 id="stock-title" className="stock-panel__title">Availability snapshot</h2>
              <p className="stock-panel__note">Live from the campus inventory ledger</p>
            </div>
            <span className="live-badge">Live</span>
          </div>
          <div className="stock-list" aria-live="polite">
            {products.length === 0 ? (
              <div className="empty-state">
                <PackageX className="react-icon" aria-hidden="true" />
                <p className="empty-state__title">Inventory is not available</p>
                <p className="empty-state__description">
                  Please check back once the store ledger is connected.
                </p>
              </div>
            ) : (
              products.slice(0, 3).map((product) => {
                const badge = getStockBadge(product.stock);
                return (
                  <div className="stock-list__item" key={product.id}>
                    <div>
                      <div className="stock-list__name">{product.name}</div>
                      <p className="stock-list__org">{product.organization}</p>
                    </div>
                    <span className={badge.className}>{badge.text}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="stock-panel__footer">
            <Link to="/catalog" className="text-link">
              View full inventory <ArrowUpRight className="react-icon" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </main>

      <section className="page-shell category-section" aria-labelledby="category-title">
        <div className="category-section__header">
          <div>
            <p className="section-kicker">Shop by need</p>
            <h2 id="category-title" className="section-title">Official items, ready for pickup</h2>
            <p className="section-description">
              Find the right school or organization item without the campus queue.
            </p>
          </div>
          <Link to="/catalog" className="text-link">All merchandise <ArrowUpRight className="react-icon" aria-hidden="true" /></Link>
        </div>

        <div className="category-grid">
          <Link to="/catalog?category=ID Lace" className="category-card glass-card-hover">
            <div className="category-card__top">
              <span className="category-card__icon"><Badge className="react-icon" aria-hidden="true" /></span>
              <ArrowUpRight className="react-icon" aria-hidden="true" />
            </div>
            <div>
              <h3 className="category-card__title">ID laces & accessories</h3>
              <p className="category-card__description">Official lanyards, card holders, and clips.</p>
            </div>
          </Link>
          <Link to="/catalog?category=Org Uniform" className="category-card glass-card-hover">
            <div className="category-card__top">
              <span className="category-card__icon"><Shirt className="react-icon" aria-hidden="true" /></span>
              <ArrowUpRight className="react-icon" aria-hidden="true" />
            </div>
            <div>
              <h3 className="category-card__title">Organization uniforms</h3>
              <p className="category-card__description">Department polos and council apparel.</p>
            </div>
          </Link>
          <Link to="/catalog?category=School Uniform" className="category-card glass-card-hover">
            <div className="category-card__top">
              <span className="category-card__icon"><Shirt className="react-icon" aria-hidden="true" /></span>
              <ArrowUpRight className="react-icon" aria-hidden="true" />
            </div>
            <div>
              <h3 className="category-card__title">School & PE uniforms</h3>
              <p className="category-card__description">Campus uniforms, PE shirts, and joggers.</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
