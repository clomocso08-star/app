import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock3, Package, PackageOpen, ReceiptText, Store, UserRound } from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import {
  formatDate,
  formatPrice,
  getOrderDate,
  getOrderId,
  getOrderStatus,
  getOrderStatusBadge,
  getOrderTotal,
} from '../services';
type StatusFilter = 'ALL' | 'Pending' | 'Processing' | 'Ready for Pickup' | 'Claimed' | 'Cancelled';

export default function DashboardPage() {
  const { session, orders } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  useEffect(() => {
    if (!session) {
      toast('Please sign in to view your dashboard.', 'warning');
      const timer = window.setTimeout(() => navigate('/login', { replace: true }), 500);
      return () => window.clearTimeout(timer);
    }
  }, [session, navigate, toast]);

  const userOrders = useMemo(
    () => (session ? orders.filter((order) => order.userId === session.id) : []),
    [orders, session],
  );

  const filteredOrders = useMemo(
    () =>
      userOrders.filter(
        (order) => statusFilter === 'ALL' || getOrderStatus(order) === statusFilter,
      ),
    [userOrders, statusFilter],
  );

  const { pendingCount, totalSpent } = useMemo(
    () => ({
      pendingCount: userOrders.filter((order) =>
        ['Pending', 'Processing'].includes(getOrderStatus(order)),
      ).length,
      totalSpent: userOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
    }),
    [userOrders],
  );

  if (!session) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <p className="empty-state__title">Please sign in to continue</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="profile-panel" aria-labelledby="user-name">
        <div className="profile-panel__identity">
          <div className="profile-avatar" aria-hidden="true">
            <UserRound className="react-icon" aria-hidden="true" />
          </div>
          <div className="profile-details">
            <h1 id="user-name" className="profile-details__name">
              {session.name} <span className="status-chip status-chip--info">{session.role}</span>
            </h1>
            <p className="profile-details__email">{session.email}</p>
            <div className="profile-meta">
              <span>ID number: <strong>{session.idNumber || session.id}</strong></span>
              <span>Organization: <strong>{session.organization || 'SJCM General'}</strong></span>
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <Link to="/catalog" className="button button--primary">
            <Store className="react-icon" aria-hidden="true" />
            <span>Browse store</span>
          </Link>
        </div>
      </section>

      <section className="stats-grid" aria-label="Order summary">
        <article className="stat-card" style={{ '--metric-color': 'var(--color-info)' } as CSSProperties}>
          <div className="stat-card__top">
            <span className="stat-card__label">Total orders</span>
            <span className="stat-card__icon"><Package className="react-icon" aria-hidden="true" /></span>
          </div>
          <strong className="metric-value">{userOrders.length}</strong>
        </article>
        <article className="stat-card" style={{ '--metric-color': 'var(--color-warning)' } as CSSProperties}>
          <div className="stat-card__top">
            <span className="stat-card__label">Pending pickup</span>
            <span className="stat-card__icon"><Clock3 className="react-icon" aria-hidden="true" /></span>
          </div>
          <strong className="metric-value">{pendingCount}</strong>
        </article>
        <article className="stat-card" style={{ '--metric-color': 'var(--color-success)' } as CSSProperties}>
          <div className="stat-card__top">
            <span className="stat-card__label">Total spent</span>
            <span className="stat-card__icon"><ReceiptText className="react-icon" aria-hidden="true" /></span>
          </div>
          <strong className="metric-value">{formatPrice(totalSpent)}</strong>
        </article>
      </section>

      <section className="data-panel" aria-labelledby="orders-title">
        <div className="data-panel__header">
          <div>
            <p className="section-kicker">Your activity</p>
            <h2 id="orders-title" className="section-title">Order history</h2>
            <p className="section-description">Track merchandise reservations and pickup status.</p>
          </div>
          <div className="table-filter">
            <label htmlFor="order-status-filter">Filter status</label>
            <select
              id="order-status-filter"
              className="field-control"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="ALL">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Ready for Pickup">Ready for pickup</option>
              <option value="Claimed">Claimed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <caption className="sr-only">Your merchandise order history</caption>
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Date</th>
                <th scope="col">Items</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col" className="data-table__action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <PackageOpen className="react-icon" aria-hidden="true" />
                      <p className="empty-state__title">No reservations found</p>
                      <p className="empty-state__description">
                        Your orders will appear here once you place a campus pickup reservation.
                      </p>
                      <Link to="/catalog" className="button button--primary">Browse catalog</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getOrderStatusBadge(getOrderStatus(order));
                  const itemCount = (order.items ?? []).reduce(
                    (sum, item) => sum + (Number(item.qty) || 0),
                    0,
                  );
                  return (
                    <tr key={getOrderId(order)}>
                      <td><span className="data-table__primary font-mono">{getOrderId(order)}</span></td>
                      <td>{formatDate(getOrderDate(order))}</td>
                      <td>{itemCount} item{itemCount === 1 ? '' : 's'}</td>
                      <td className="data-table__numeric">{formatPrice(getOrderTotal(order))}</td>
                      <td><span className={badge.className}>{badge.text}</span></td>
                      <td className="data-table__action">
                        <Link to={`/orders/${encodeURIComponent(getOrderId(order))}`} className="text-link">
                          Details <ArrowUpRight className="react-icon" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
