import { useState, useEffect } from 'react';
import { User, Order, convertToNumber, QUOTE_PRECISION, BASE_PRECISION, isVariant, BN } from '@drift-labs/sdk';
import { markets } from '../utils/markets';

interface OrderHistoryProps {
  user: User | null;
}

const OrderHistory = ({ user }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'filled' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = () => {
        setLoading(true);
        try {
          const userOrders = user.getOpenOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
      // Refresh orders every 5 seconds
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getMarketName = (marketIndex: number) => {
    const market = markets.find((m) => m.marketIndex === marketIndex);
    return market ? market.name : `Market ${marketIndex}`;
  };

  const getOrderType = (order: Order): string => {
    if (isVariant(order.orderType, 'market')) return 'Market';
    if (isVariant(order.orderType, 'limit')) return 'Limit';
    if (isVariant(order.orderType, 'triggerMarket')) return 'Stop Market';
    if (isVariant(order.orderType, 'triggerLimit')) return 'Stop Limit';
    return 'Unknown';
  };

  const getOrderStatus = (order: Order): string => {
    if (isVariant(order.status, 'open')) return 'Open';
    if (isVariant(order.status, 'filled')) return 'Filled';
    if (isVariant(order.status, 'cancelled')) return 'Cancelled';
    return 'Unknown';
  };

  const getDirection = (order: Order): string => {
    return isVariant(order.direction, 'long') ? 'LONG' : 'SHORT';
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    const status = getOrderStatus(order);
    return status.toLowerCase() === filter;
  });

  if (!user) {
    return null;
  }

  if (loading && orders.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📋 Order History</h2>
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-2xl">
            📋 Order History
            {orders.length > 0 && (
              <span className="badge badge-secondary">{orders.length}</span>
            )}
          </h2>

          {/* Filter Buttons */}
          <div className="join">
            <button
              className={`btn btn-sm join-item ${filter === 'all' ? 'btn-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn btn-sm join-item ${filter === 'open' ? 'btn-active' : ''}`}
              onClick={() => setFilter('open')}
            >
              Open
            </button>
            <button
              className={`btn btn-sm join-item ${filter === 'filled' ? 'btn-active' : ''}`}
              onClick={() => setFilter('filled')}
            >
              Filled
            </button>
            <button
              className={`btn btn-sm join-item ${filter === 'cancelled' ? 'btn-active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              {filter === 'all'
                ? 'No orders yet. Start trading to see your order history here.'
                : `No ${filter} orders found.`}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Market</th>
                  <th>Type</th>
                  <th>Side</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Filled</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => {
                  const direction = getDirection(order);
                  const orderType = getOrderType(order);
                  const status = getOrderStatus(order);
                  const isLong = direction === 'LONG';

                  return (
                    <tr key={idx} className="hover">
                      <td className="font-bold">{getMarketName(order.marketIndex)}</td>
                      <td>
                        <span className="badge badge-outline">{orderType}</span>
                      </td>
                      <td>
                        <span className={`badge ${isLong ? 'badge-success' : 'badge-error'}`}>
                          {isLong ? '📈 LONG' : '📉 SHORT'}
                        </span>
                      </td>
                      <td>{convertToNumber(order.baseAssetAmount, BASE_PRECISION).toFixed(4)}</td>
                      <td>
                        {order.price.gt(new BN(0))
                          ? `$${convertToNumber(order.price, QUOTE_PRECISION).toFixed(2)}`
                          : 'Market'}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            status === 'Open'
                              ? 'badge-warning'
                              : status === 'Filled'
                              ? 'badge-success'
                              : 'badge-ghost'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        {convertToNumber(order.baseAssetAmountFilled, BASE_PRECISION).toFixed(4)} /{' '}
                        {convertToNumber(order.baseAssetAmount, BASE_PRECISION).toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
