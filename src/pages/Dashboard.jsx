import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    ingresos: 0,
    usuarios: 0,
    pedidosTotal: 0,
    conversion: '4.8%' // Static for now as we don't have visits data
  });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Users Count
      const { count: usersCount, error: usersErr } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true });
        
      // 2. Fetch Pedidos for metrics and charts
      const { data: pedidosData, error: pedidosErr } = await supabase
        .from('pedidos')
        .select('total, fecha_pedido')
        .neq('estado', 'cancelado'); // active orders

      if (usersErr || pedidosErr) {
        console.error("Error fetching dashboard data", usersErr, pedidosErr);
        return;
      }

      // Calculate Totals
      let totalIngresos = 0;
      let orderCount = pedidosData ? pedidosData.length : 0;
      
      // Temporary object to group sales by day of week
      const daysStr = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const groupedByDay = { 'Lun': 0, 'Mar': 0, 'Mié': 0, 'Jue': 0, 'Vie': 0, 'Sáb': 0, 'Dom': 0 };

      pedidosData?.forEach(p => {
        const val = Number(p.total);
        totalIngresos += val;
        
        // Assuming fecha_pedido is a valid date string
        const d = new Date(p.fecha_pedido);
        const dayName = daysStr[d.getDay()];
        groupedByDay[dayName] = (groupedByDay[dayName] || 0) + val;
      });

      // Format for recharts
      const chartData = daysStr.map(day => ({
        name: day,
        ventas: groupedByDay[day]
      }));

      // Shift array so Monday is first
      const sundayIdx = chartData.findIndex(d => d.name === 'Dom');
      const sundayItem = chartData.splice(sundayIdx, 1)[0];
      chartData.push(sundayItem); // push to end or keep order, let's keep Mon-Sun order.

      setMetrics({
        ingresos: totalIngresos,
        usuarios: usersCount || 0,
        pedidosTotal: orderCount,
        conversion: '4.8%' // Mocked based on visits we don't track
      });
      setSalesData(chartData);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1rem', background: 'var(--bg-primary)', minHeight: '90vh' }}>
      <div className="container">
        <header className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h1 className="heading-lg">Panel de <span className="text-gradient-gold">Control</span></h1>
            <p className="text-muted">Resumen de operaciones en tiempo real.</p>
          </div>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={fetchDashboardData}>
            Actualizar Datos
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center flex-col items-center" style={{ height: '50vh' }}>
            <Loader2 size={48} color="var(--gold-main)" className="animate-spin" />
            <p className="text-muted" style={{ marginTop: '1rem' }}>Obteniendo métricas...</p>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '3rem' }}>
              {[
                { title: 'Ingresos Totales', value: `$${metrics.ingresos.toLocaleString()}`, icon: <DollarSign />, trend: '+12.5%' },
                { title: 'Usuarios Registrados', value: metrics.usuarios.toLocaleString(), icon: <Users />, trend: '+4.2%' },
                { title: 'Pedidos Exitosos', value: metrics.pedidosTotal.toLocaleString(), icon: <Package />, trend: '+18.1%' },
                { title: 'Tasa de Conversión', value: metrics.conversion, icon: <TrendingUp />, trend: '-1.2%' }
              ].map((stat, i) => (
                <div key={i} className="card glass-panel flex-col justify-between" style={{ padding: '1.5rem', minHeight: '140px' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-muted" style={{ fontWeight: 500 }}>{stat.title}</span>
                    <span style={{ color: 'var(--gold-main)' }}>{stat.icon}</span>
                  </div>
                  <div className="flex justify-between items-end" style={{ marginTop: '1rem' }}>
                    <span className="heading-md" style={{ fontSize: '2rem' }}>{stat.value}</span>
                    <span style={{ 
                      color: stat.trend.startsWith('+') ? '#4ade80' : '#f87171',
                      background: stat.trend.startsWith('+') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {Math.abs(parseFloat(stat.trend))}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
              <div className="card glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Evolución de Ventas ($)</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                      <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-gold)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--gold-main)' }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Line type="monotone" dataKey="ventas" stroke="var(--gold-main)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-primary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Ventas Acumuladas por Día</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                      <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-gold)', borderRadius: '8px' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Bar dataKey="ventas" fill="var(--gold-dark)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
