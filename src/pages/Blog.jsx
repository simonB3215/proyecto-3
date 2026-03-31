import React from 'react';
import { Clock, User } from 'lucide-react';

const Blog = () => {
  return (
    <div className="animate-fade-in" style={{ padding: '4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <article className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
          <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '0.4rem 1.2rem', background: 'rgba(234, 179, 8, 0.1)', color: 'var(--gold-main)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
              Carta del Fundador
            </div>
            <h1 className="heading-lg" style={{ marginBottom: '1.5rem' }}>
              Por qué construimos <span className="text-gradient-gold">El Dorado</span>
            </h1>
            
            <div className="flex gap-6 justify-center text-muted" style={{ fontSize: '0.9rem' }}>
              <span className="flex items-center gap-2"><User size={16} /> Roberto C. - CEO</span>
              <span className="flex items-center gap-2"><Clock size={16} /> 5 min de lectura</span>
              <span>• Octubre 2026</span>
            </div>
          </header>

          <div style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.8',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <p>
              Todos tenemos ese recuerdo: buscar la excelencia y conformarnos con lo ordinario. Hace varios años, decidimos que esta narrativa debía cambiar. El Dorado no nació solo como un supermercado comercial, sino como un proyecto de pasión, impulsado por una misión clara: redefinir el estándar de calidad en la industria del retail.
            </p>
            
            <div style={{ 
              padding: '2rem', 
              borderLeft: '4px solid var(--gold-main)', 
              background: 'rgba(234, 179, 8, 0.05)',
              borderRadius: '0 1rem 1rem 0',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              margin: '1rem 0'
            }}>
              "Decidimos crear El Dorado con un pilar fundacional: Tu tiempo, tu estilo y tu bienestar valen exactamente eso, oro puro."
            </div>

            <p>
              Desde los primeros días de la fundación de la empresa, nos obsesionamos con el poder del detalle. Viajamos y conectamos directamente con los artesanos, los productores agrícolas más dedicados y los diseñadores más exclusivos. Queríamos asegurar que cada artículo en nuestros estantes tuviera una procedencia impecable.
            </p>

            <h3 className="heading-md" style={{ color: 'var(--text-primary)', marginTop: '2rem' }}>La Promesa Dorada</h3>

            <p>
              Para nosotros, llamarlo "catálogo" se queda corto; es una selección curada. Si un producto (desde una prenda hasta la tecnología de tu hogar) lleva nuestro sello de aprobación, significa que ha atravesado nuestros rigurosos filtros de calidad corporativos. Nuestra empresa se fundamenta en la transparencia total y en la firme creencia de que el consumidor merece siempre lo extraordinario.
            </p>

            <p>
              Y no es solo el producto, es la comunidad y el legado que estamos construyendo. Nuestro compromiso como corporación es hacer que lo premium sea accesible y que la experiencia de comprar recupere ese sentimiento de magia, elegancia y exclusividad extrema.
            </p>

            <p>
              Bienvenidos a la nueva era del retail. Esperamos que disfrute cada aspecto de El Dorado tanto como nosotros hemos disfrutado forjando sus bases para usted.
            </p>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-main), var(--gold-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'black' }}>
                RC
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Roberto C.</strong>
                <div style={{ fontSize: '0.9rem' }}>Fundador & CEO</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Blog;
