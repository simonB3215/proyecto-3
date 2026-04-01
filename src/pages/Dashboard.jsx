import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Users, ShieldAlert, Loader2, Database, Laptop, RefreshCw, Edit, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', precio: 0, stock: 0, estado: 'activo' });
  const [isSaving, setIsSaving] = useState(false);
  const [metrics, setMetrics] = useState({
    totalProductos: 0,
    stockCritico: 0,
    totalUsuarios: 0,
    admins: 0
  });

  const fetchData = async () => {
    try {
      setRefreshing(true);
      // 1. Obtener Productos y Categorías
      const { data: prodData, error: prodErr } = await supabase
        .from('productos')
        .select(`id, nombre, precio, stock, estado, fecha_creacion, categorias(nombre)`)
        .order('stock', { ascending: true }); // Priorizamos ver los de menor stock
      
      // 2. Obtener Usuarios
      const { data: userData, error: userErr } = await supabase
        .from('usuarios')
        .select(`id, nombre, apellido, email, telefono, rol, fecha_registro`)
        .order('fecha_registro', { ascending: false });

      if (prodErr || userErr) throw (prodErr || userErr);

      const prods = prodData || [];
      const users = userData || [];

      setProductos(prods);
      setUsuarios(users);

      setMetrics({
        totalProductos: prods.length,
        stockCritico: prods.filter(p => p.stock <= 5).length,
        totalUsuarios: users.length,
        admins: users.filter(u => u.rol === 'admin').length
      });

    } catch (e) {
      console.error("Error cargando dashboard:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      estado: product.estado
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: editForm.nombre,
          precio: editForm.precio,
          stock: editForm.stock,
          estado: editForm.estado
        })
        .eq('id', editingProduct.id);

      if (error) throw error;
      
      setEditingProduct(null);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '80vh' }}>
        <Loader2 size={48} color="var(--gold-main)" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade-in" style={{ padding: '2rem 1.5rem', minHeight: '90vh' }}>
      
      {/* HEADER TÉCNICO */}
      <header className="flex justify-between items-center" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="flex items-center gap-3">
          <Database color="var(--gold-main)" size={28} />
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.5px', margin: 0 }}>
              PANEL DE <span className="text-gradient-gold">OPERACIONES</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', margin: '0.2rem 0 0 0' }}>
              SYS_STATUS: ONLINE | LATENCY: ~45ms | DB_CONN: ESTABLISHED
            </p>
          </div>
        </div>
        <button 
          onClick={fetchData} 
          disabled={refreshing}
          className="btn" 
          style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'monospace' }}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} color="var(--gold-main)" /> 
          SYNC_DATA
        </button>
      </header>

      {/* MÉTRICAS KPI (Key Performance Indicators) */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2.5rem' }}>
        
        <div className="kpi-card">
          <div className="kpi-icon"><Package size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">TOTAL PRODUCTOS</span>
            <span className="kpi-value">{metrics.totalProductos}</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderColor: metrics.stockCritico > 0 ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)' }}>
          <div className="kpi-icon" style={{ color: metrics.stockCritico > 0 ? '#ef4444' : 'var(--gold-main)' }}><AlertTriangle size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label" style={{ color: metrics.stockCritico > 0 ? '#ef4444' : 'var(--text-secondary)' }}>ALERTA STOCK CRÍTICO (&le; 5)</span>
            <span className="kpi-value" style={{ color: metrics.stockCritico > 0 ? '#ef4444' : 'var(--text-primary)' }}>{metrics.stockCritico}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><Users size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">TOTAL USUARIOS</span>
            <span className="kpi-value">{metrics.totalUsuarios}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><ShieldAlert size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">ADMINISTRADORES</span>
            <span className="kpi-value">{metrics.admins}</span>
          </div>
        </div>

      </div>

      {/* SECCIÓN DE TABLAS DE DATOS */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr', marginBottom: '3rem' }}>
        
        {/* TABLA: INVENTARIO */}
        <div className="data-panel">
          <div className="panel-header">
            <h3>DATOS_INVENTARIO [DB: productos]</h3>
            <span className="badge">Filas: {productos.length}</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU/ID</th>
                  <th>PRODUCTO</th>
                  <th>CATEGORÍA</th>
                  <th>PRECIO</th>
                  <th>ESTADO</th>
                  <th>STOCK</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td className="mono muted">#{String(p.id).padStart(5, '0')}</td>
                    <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                    <td className="lowercase">{p.categorias?.nombre || 'N/A'}</td>
                    <td className="mono">${Number(p.precio).toLocaleString()}</td>
                    <td>
                      <span className={`status-pill ${p.estado === 'activo' ? 'active' : 'inactive'}`}>
                        {p.estado.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`stock-badge ${p.stock <= 5 ? 'critical' : p.stock <= 15 ? 'warning' : 'good'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(p)} className="btn btn-ghost" style={{ padding: '0.4rem', color: 'var(--gold-main)' }} title="Editar Producto">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLA: USUARIOS */}
        <div className="data-panel">
          <div className="panel-header">
            <h3>REGISTRO_USUARIOS [DB: usuarios]</h3>
            <span className="badge">Filas: {usuarios.length}</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>UUID</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>CORREO ELECTRÓNICO</th>
                  <th>TELÉFONO</th>
                  <th>ROL</th>
                  <th>FECHA REGISTRO</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td className="mono muted">usr_{String(u.id).padStart(4, '0')}</td>
                    <td style={{ fontWeight: 500 }}>{u.nombre} {u.apellido}</td>
                    <td className="mono" style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td className="mono muted">{u.telefono || 'N/A'}</td>
                    <td>
                      <span className={`status-pill ${u.rol === 'admin' ? 'admin' : 'user'}`}>
                        {String(u.rol).toUpperCase()}
                      </span>
                    </td>
                    <td className="mono muted">{new Date(u.fecha_registro).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL DE EDICIÓN */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => !isSaving && setEditingProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <h2 className="heading-md" style={{ margin: 0 }}>Editar Producto</h2>
              <button onClick={() => setEditingProduct(null)} className="btn btn-ghost" style={{ padding: '0.5rem' }} disabled={isSaving}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Nombre del Producto</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editForm.nombre} 
                  onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Precio ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editForm.precio} 
                  onChange={(e) => setEditForm({...editForm, precio: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Stock Actual</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editForm.stock} 
                    onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Estado</label>
                  <select 
                    className="form-input" 
                    value={editForm.estado} 
                    onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingProduct(null)} disabled={isSaving}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* ESTILOS TÉCNICOS PARA EL ADMIN DASHBOARD */
        .admin-layout {
          font-family: 'Inter', system-ui, sans-serif;
        }

        .mono { font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; }
        .muted { color: var(--text-secondary); opacity: 0.8; }
        .lowercase { text-transform: lowercase; }

        .kpi-card {
          background: rgba(10, 10, 12, 0.4);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 1.25rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }
        .kpi-card:hover { border-color: rgba(255, 215, 0, 0.3); background: rgba(255, 215, 0, 0.02); }
        .kpi-icon { color: var(--gold-main); opacity: 0.8; }
        .kpi-data { display: flex; flex-direction: column; }
        .kpi-label { font-size: 0.7rem; letter-spacing: 1px; color: var(--text-secondary); margin-bottom: 0.4rem; font-family: monospace; }
        .kpi-value { font-size: 1.8rem; font-weight: 600; line-height: 1; font-family: monospace; letter-spacing: -1px; }

        .data-panel {
          background: rgba(10, 10, 12, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          overflow: hidden;
        }
        .panel-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .panel-header h3 { margin: 0; font-size: 0.9rem; font-family: monospace; letter-spacing: 0.5px; color: var(--gold-light); }
        .badge { background: rgba(255, 255, 255, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-family: monospace; }

        .table-responsive { width: 100%; overflow-x: auto; }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }
        .data-table th {
          padding: 0.75rem 1.25rem;
          background: rgba(255,255,255,0.02);
          color: var(--text-secondary);
          font-family: monospace;
          font-size: 0.7rem;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          white-space: nowrap;
        }
        .data-table td {
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          white-space: nowrap;
        }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,215,0,0.02); }

        .status-pill {
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          display: inline-block;
          font-family: monospace;
        }
        .status-pill.active { background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .status-pill.inactive { background: rgba(156, 163, 175, 0.15); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }
        .status-pill.admin { background: rgba(255, 215, 0, 0.15); color: var(--gold-main); border: 1px solid rgba(255,215,0,0.2); }
        .status-pill.user { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }

        .stock-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-weight: 700;
          font-family: monospace;
          display: inline-block;
          min-width: 40px;
          text-align: center;
        }
        .stock-badge.critical { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .stock-badge.warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .stock-badge.good { color: var(--text-primary); }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
