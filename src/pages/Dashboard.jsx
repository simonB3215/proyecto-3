import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Users, ShieldAlert, Loader2, Database, DollarSign, Laptop, RefreshCw, Edit, X, Save, Play, Square, Activity } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', precio: 0, stock: 0, estado: 'activo' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveUsers, setLiveUsers] = useState(0);
  const [liveEvents, setLiveEvents] = useState([]);
  
  const productosRef = React.useRef(productos);
  useEffect(() => {
    productosRef.current = productos;
  }, [productos]);

  const metrics = {
    totalProductos: productos.length,
    totalStock: productos.reduce((acc, p) => acc + (parseInt(p.stock) || 0), 0),
    valorInventario: productos.reduce((acc, p) => acc + ((parseInt(p.stock) || 0) * (Number(p.precio) || 0)), 0),
    stockCritico: productos.filter(p => p.stock <= 5).length,
    totalUsuarios: usuarios.length,
    admins: usuarios.filter(u => u.rol === 'admin').length
  };

  const statsPorCategoria = productos.reduce((acc, p) => {
    const catName = p.categorias?.nombre || 'Sin Categoría';
    if (!acc[catName]) acc[catName] = { cantidad: 0, stock: 0 };
    acc[catName].cantidad += 1;
    acc[catName].stock += (parseInt(p.stock) || 0);
    return acc;
  }, {});

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

  // --- IA Simulator Logic ---
  const nombresRandom = ["Sofía L.", "Mateo D.", "Camila P.", "Valentina M.", "Carlos B.", "María F.", "Joaquín R.", "Lucía C.", "Javier S.", "Renata G."];
  const accionesRandom = ["agregó al carrito", "terminó de pagar", "está revisando", "añadió a favoritos"];

  useEffect(() => {
    let intervalId;
    if (isSimulating) {
      setLiveUsers(prev => prev === 0 ? Math.floor(Math.random() * 5) + 28 : prev);
      
      intervalId = setInterval(() => {
        setLiveUsers(prev => {
          const delta = Math.floor(Math.random() * 5) - 2;
          let next = prev + delta;
          if (next < 25) next = 25;
          if (next > 45) next = 45;
          return next;
        });

        // Simulación: Inyectar un usuario falsamente registrado a la BD Virtual
        if (Math.random() > 0.95) {
          const rUser = nombresRandom[Math.floor(Math.random() * nombresRandom.length)];
          const partes = rUser.split(" ");
          const nuevoSimUsuario = {
            id: Date.now() % 10000, // Pseudo-ID seguro
            nombre: partes[0],
            apellido: partes[1] || '',
            email: `${partes[0].toLowerCase()}${Math.floor(Math.random()*100)}@simulado.com`,
            telefono: '+56 9 0000 0000',
            rol: 'user',
            fecha_registro: new Date().toISOString()
          };
          setUsuarios(prev => [nuevoSimUsuario, ...prev]);
          setLiveEvents(prev => [{
            id: Date.now() + 1,
            text: `⭐ ¡Nuevo perfil! ${rUser} se acaba de registrar en la interfaz.`,
            time: new Date().toLocaleTimeString()
          }, ...prev].slice(0, 15));
        }

        // Simulación: Movimiento de compras y eventos
        if (Math.random() > 0.5 && productosRef.current.length > 0) {
          const rUser = nombresRandom[Math.floor(Math.random() * nombresRandom.length)];
          let actionText = accionesRandom[Math.floor(Math.random() * accionesRandom.length)];
          let targetProduct = productosRef.current[Math.floor(Math.random() * productosRef.current.length)];

          const isCompra = actionText === "terminó de pagar";
          
          if (isCompra && targetProduct.stock > 0) {
            // REDUCE STOCK en memoria RAM
            setProductos(prevProds => prevProds.map(p => {
              if (p.id === targetProduct.id && p.stock > 0) {
                return { ...p, stock: p.stock - 1 };
              }
              return p;
            }));
          } else if (isCompra && targetProduct.stock <= 0) {
            actionText = "añadió a favoritos"; // Si agotó, se disfraza la compra
          }

          setLiveEvents(prev => [{
            id: Date.now(),
            text: `${rUser} ${actionText} "${targetProduct.nombre}"`,
            time: new Date().toLocaleTimeString()
          }, ...prev].slice(0, 15));
        }
      }, 2500); // Trigger a cada 2.5 segs
    } else {
      setLiveUsers(0);
    }
    return () => clearInterval(intervalId);
  }, [isSimulating]);

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
        <div className="flex flex-col-mobile gap-3" style={{ alignItems: 'stretch' }}>
          <button 
            onClick={() => {
              setIsSimulating(!isSimulating);
              if (isSimulating) setLiveEvents([]);
            }} 
            className="btn" 
            style={{ padding: '0.5rem 1rem', background: isSimulating ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)', border: `1px solid ${isSimulating ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`, color: isSimulating ? '#ef4444' : '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'monospace' }}
          >
            {isSimulating ? <><Square size={14} fill="currentColor" /> DETENER SIMULACIÓN</> : <><Play size={14} fill="currentColor" /> SIMULAR TRÁFICO IA</>}
          </button>
          
          <button 
            onClick={fetchData} 
            disabled={refreshing}
            className="btn" 
            style={{ padding: '0.5rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'monospace' }}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} color="var(--gold-main)" /> 
            SYNC_DATA
          </button>
        </div>
      </header>

      {/* BANNER VALOR TOTAL INVENTARIO */}
      <div className="card animate-fade-in" style={{
        marginBottom: '2rem',
        padding: '1.5rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(10, 10, 12, 0.8) 100%)',
        border: '1px solid var(--border-gold)',
        borderLeft: '4px solid var(--gold-main)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <DollarSign color="var(--gold-main)" size={20} />
          <h2 style={{ fontSize: '0.9rem', color: 'var(--gold-main)', letterSpacing: '1px', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>Valor Total del Inventario</h2>
        </div>
        <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
          ${metrics.valorInventario.toLocaleString()}
        </div>
      </div>

      {/* MÉTRICAS KPI (Key Performance Indicators) */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2.5rem' }}>
        
        <div className="kpi-card">
          <div className="kpi-icon"><Package size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">TOTAL SKU (CATÁLOGO)</span>
            <span className="kpi-value">{metrics.totalProductos}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><Database size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">STOCK TOTAL (UNIDADES)</span>
            <span className="kpi-value">{metrics.totalStock.toLocaleString()}</span>
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

        <div className="kpi-card">
          <div className="kpi-icon"><Activity size={20} color={isSimulating ? '#4ade80' : 'var(--text-secondary)'} /></div>
          <div className="kpi-data">
            <span className="kpi-label">USUARIOS ONLINE</span>
            <span className="kpi-value" style={{ color: isSimulating ? '#4ade80' : 'var(--text-primary)' }}>
              {isSimulating ? liveUsers : '0'}
            </span>
          </div>
        </div>

      </div>

      {/* DETALLES POR CATEGORÍA */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 className="heading-md" style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--gold-main)' }}>Stock por Categoría</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {Object.entries(statsPorCategoria).map(([cat, stats]) => (
            <div key={cat} className="card animate-fade-in" style={{ padding: '1.25rem', background: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.1)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>{cat}</h4>
              <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Variedades (SKUs):</span>
                <span className="mono" style={{ color: 'var(--text-primary)' }}>{stats.cantidad}</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Stock Total:</span>
                <span className="mono" style={{ fontWeight: 600, color: 'var(--gold-main)' }}>{stats.stock} und</span>
              </div>
            </div>
          ))}
          {Object.keys(statsPorCategoria).length === 0 && !loading && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No hay información de categorías.</p>
          )}
        </div>
      </div>

      {/* SIMULADOR FEED */}
      {isSimulating && (
        <div className="card animate-fade-in" style={{ marginBottom: '3rem', background: 'rgba(15, 20, 25, 0.8)', border: '1px solid var(--border-subtle)', padding: '1.5rem' }}>
          <h3 className="heading-md" style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity color="#4ade80" size={18} className="animate-spin" style={{ animationDuration: '3s' }} /> 
            Registro de Actividad (IA Simulación)
          </h3>
          <div style={{ height: '160px', overflowY: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius)' }} className="mono">
            {liveEvents.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Esperando interacciones de usuarios simulados...</p>
            ) : (
              liveEvents.map(ev => (
                <div key={ev.id} className="animate-fade-in" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0', fontSize: '0.85rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>[{ev.time}]</span>
                  <span style={{ flex: 1, color: ev.text.includes('pagar') ? '#4ade80' : 'var(--text-primary)' }}>{ev.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN DE TABLAS DE DATOS */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr', marginBottom: '3rem' }}>
        
        {/* TABLA: INVENTARIO */}
        <div className="data-panel">
          <div className="panel-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h3>DATOS_INVENTARIO [DB: productos]</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'rgba(255, 215, 0, 0.15)', color: 'var(--gold-main)' }}>Valor Total: ${metrics.valorInventario.toLocaleString()}</span>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>Stock Total: {metrics.totalStock.toLocaleString()}</span>
              <span className="badge">SKUs: {productos.length}</span>
            </div>
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
                    <td data-label="SKU/ID" className="mono muted">#{String(p.id).padStart(5, '0')}</td>
                    <td data-label="PRODUCTO" style={{ fontWeight: 500 }}>{p.nombre}</td>
                    <td data-label="CATEGORÍA" className="lowercase">{p.categorias?.nombre || 'N/A'}</td>
                    <td data-label="PRECIO" className="mono">${Number(p.precio).toLocaleString()}</td>
                    <td data-label="ESTADO">
                      <span className={`status-pill ${p.estado === 'activo' ? 'active' : 'inactive'}`}>
                        {p.estado.toUpperCase()}
                      </span>
                    </td>
                    <td data-label="STOCK">
                      <span className={`stock-badge ${p.stock <= 5 ? 'critical' : p.stock <= 15 ? 'warning' : 'good'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td data-label="ACCIONES">
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
          <div className="panel-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h3>REGISTRO_USUARIOS [DB: usuarios]</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'rgba(255, 215, 0, 0.15)', color: 'var(--gold-main)' }}>Admins: {metrics.admins}</span>
              <span className="badge">Total Usuarios: {usuarios.length}</span>
            </div>
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
                    <td data-label="UUID" className="mono muted">usr_{String(u.id).padStart(4, '0')}</td>
                    <td data-label="NOMBRE COMPLETO" style={{ fontWeight: 500 }}>{u.nombre} {u.apellido}</td>
                    <td data-label="CORREO ELECTRÓNICO" className="mono" style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td data-label="TELÉFONO" className="mono muted">{u.telefono || 'N/A'}</td>
                    <td data-label="ROL">
                      <span className={`status-pill ${u.rol === 'admin' ? 'admin' : 'user'}`}>
                        {String(u.rol).toUpperCase()}
                      </span>
                    </td>
                    <td data-label="FECHA REGISTRO" className="mono muted">{new Date(u.fecha_registro).toLocaleDateString()}</td>
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
        .kpi-icon { color: var(--gold-main); opacity: 0.8; flex-shrink: 0; }
        .kpi-data { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .kpi-label { font-size: 0.7rem; letter-spacing: 1px; color: var(--text-secondary); margin-bottom: 0.4rem; font-family: monospace; line-height: 1.2; }
        .kpi-value { font-size: clamp(1.1rem, 3.5vw, 1.8rem); font-weight: 600; line-height: 1.1; font-family: monospace; letter-spacing: -1px; word-break: break-all; }

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

        @media (max-width: 768px) {
          .data-table thead { display: none; }
          .data-table tr { 
            display: block; 
            border-bottom: 1px solid var(--border-gold) !important; 
            margin-bottom: 0.5rem; 
            background: rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
            padding: 0.5rem 0;
          }
          .data-table tr:hover td { background: transparent; }
          .data-table td { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border: none; 
            padding: 0.5rem 1.25rem; 
            text-align: right;
          }
          .data-table td::before { 
            content: attr(data-label); 
            font-weight: 600; 
            color: var(--text-secondary); 
            text-transform: uppercase; 
            font-size: 0.7rem; 
            margin-right: 1rem; 
            font-family: monospace;
            text-align: left;
            flex-shrink: 0;
          }
          .header-text { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem; }
        }

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
