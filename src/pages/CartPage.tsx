import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Minus, Package, Plus, ShoppingBag, Store, Trash2 } from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import { formatPrice, isStaffRole, sumCartItems } from '../services';

export default function CartPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { session, cart, products, setCart } = useApp();

  const subtotal = useMemo(() => sumCartItems(cart), [cart]);

  const updateQty = (index: number, delta: number) => {
    const item = cart[index];
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      removeItem(index);
      return;
    }

    const product = products.find((candidate) => candidate.id === item.id);
    if (product && newQty > product.stock) {
      toast(`Stock limit reached. Only ${product.stock} available.`, 'warning');
      return;
    }

    const nextCart = [...cart];
    nextCart[index] = { ...item, qty: newQty };
    setCart(nextCart);
  };

  const removeItem = (index: number) => {
    const nextCart = cart.filter((_, cartIndex) => cartIndex !== index);
    setCart(nextCart);
    toast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    if (!cart.length) return;
    setCart([]);
    toast('Cart cleared', 'info');
  };

  const proceedToCheckout = () => {
    if (!session) {
      toast('Please sign in to proceed to checkout.', 'warning');
      navigate('/login');
      return;
    }
    if (isStaffRole(session.role)) {
      toast('Staff and admin accounts cannot place customer orders.', 'warning');
      return;
    }
    if (!cart.length) {
      toast('Your cart is empty.', 'warning');
      return;
    }
    navigate('/checkout');
  };

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="page-header__copy">
          <p className="section-kicker">Reservation list</p>
          <h1 className="page-title">Your cart</h1>
          <p className="page-description">
            Review your selected merchandise before choosing a pickup date.
          </p>
        </div>
        <Link to="/catalog" className="text-link">
          <ArrowLeft className="react-icon" aria-hidden="true" />
          <span>Continue shopping</span>
        </Link>
      </header>

      <div className="commerce-layout">
        <section className="cart-list" aria-label="Cart items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag className="react-icon" aria-hidden="true" />
              <h2 className="empty-state__title">Your cart is empty</h2>
              <p className="empty-state__description">
                Explore the catalog to reserve school uniforms, department apparel, and ID laces.
              </p>
              <Link to="/catalog" className="button button--primary">
                <Store className="react-icon" aria-hidden="true" />
                <span>Browse merchandise</span>
              </Link>
            </div>
          ) : (
            cart.map((item, index) => {
              const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 0);
              return (
                <article className="cart-item" key={`${item.id}-${item.size}`}>
                  <div className="cart-item__main">
                    <div className="cart-item__media" aria-hidden="true">
                      <Package className="react-icon" aria-hidden="true" />
                    </div>
                    <div className="cart-item__details">
                      <div className="cart-item__organization">{item.organization || 'General'}</div>
                      <h2 className="cart-item__name" title={item.name}>{item.name}</h2>
                      <p className="cart-item__meta">
                        Variant: <strong>{item.size || 'N/A'}</strong>
                      </p>
                      <p className="cart-item__price">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                  <div className="cart-item__actions">
                    <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => updateQty(index, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="react-icon" aria-hidden="true" />
                      </button>
                      <span className="quantity-control__value">{item.qty}</span>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => updateQty(index, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="react-icon" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="cart-item__total">
                      <span className="cart-item__total-label">Line total</span>
                      {formatPrice(itemTotal)}
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => removeItem(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="react-icon" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="summary-panel" aria-labelledby="summary-title">
          <h2 id="summary-title" className="summary-panel__title">Reservation summary</h2>
          <div className="summary-lines">
            <div className="summary-line">
              <span>Items subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Claim & processing fee</span>
              <strong className="summary-line__free">FREE</strong>
            </div>
            <div className="summary-total">
              <span>Total estimated</span>
              <strong className="summary-total__value">{formatPrice(subtotal)}</strong>
            </div>
          </div>
          <div className="summary-actions">
            <button
              type="button"
              className="button button--primary button--block"
              onClick={proceedToCheckout}
              disabled={!cart.length}
            >
              <span>Proceed to checkout</span>
              <ArrowRight className="react-icon" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="button button--quiet button--block"
              onClick={clearCart}
              disabled={!cart.length}
            >
              Clear entire cart
            </button>
          </div>
          <div className="callout">
            <MapPin className="react-icon" aria-hidden="true" />
            <span>All orders are reserved for pickup on campus. Uniform items are not delivered.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
