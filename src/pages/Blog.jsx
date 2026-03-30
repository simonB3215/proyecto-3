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
              Todos tenemos ese recuerdo: largas filas, productos que no inspiran confianza, y una experiencia que drena energía en lugar de revitalizarnos. Ir al supermercado solía ser una tarea tediosa, algo que *debíamos* hacer.
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
              "Decidimos crear El Dorado con una sola tesis: Tu tiempo y tu nutrición valen exactamente eso, oro puro."
            </div>

            <p>
              Cuando empezamos a diseñar la plataforma (Phase 1, nuestro Dashboard), nos dimos cuenta del inmenso poder de los datos para predecir cuándo el pescado más fresco tocaba puerto, o qué granja local tenía la cosecha de arándanos en su punto óptimo de madurez.
            </p>

            <h3 className="heading-md" style={{ color: 'var(--text-primary)', marginTop: '2rem' }}>El Estándar Dorado</h3>

            <p>
              Llamarlo "supermercado" se queda corto. Es una selección curada. Si una manzana tiene nuestra etiqueta, pasó por tres filtros de calidad. En nuestra <span style={{ color: 'var(--gold-main)', fontWeight: 500 }}>Fase 2 (E-commerce)</span>, simplificamos la compra para que la belleza y transparencia orgánicas hablaran por sí mismas.
            </p>

            <p>
              Y no es solo el producto. Es la experiencia en nuestras puertas digitales, nuestra <span style={{ color: 'var(--gold-main)', fontWeight: 500 }}>Fase 3</span>. Es hacer de la alimentación premium no un lujo opaco, sino un servicio eficiente y transparente, accesible como nunca antes.
            </p>

            <p>
              Bienvenidos a El Dorado. Esperamos que disfrute cada compra tanto como nosotros disfrutamos construyendo este espacio para usted.
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
