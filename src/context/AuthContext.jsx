import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al ser una "Maqueta", no necesitamos esperar a Supabase Auth.
    // Arrancamos de inmediato.
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // SIMULACIÓN MODO MAQUETA: Sin configurar API de Google.
    // Solo pedimos el correo para actuar acorde a la base de datos.
    const email = window.prompt("Simulación de Ingreso con Google (Modo Maqueta) ✨\n\nIngresa tu correo (@gmail.com) para registrarte o iniciar sesión en la base de datos:");
    
    if (!email) return; // Si el usuario cancela

    // Verificamos que no sea un correo cualquiera
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      alert("Por favor ingresa un correo de Google válido (@gmail.com) tal como lo definimos para la maqueta.");
      return;
    }

    try {
      setLoading(true);
      // Creamos un nombre temporal a partir de su correo
      const nombreUsuario = email.split('@')[0];
      const nombreCapitalizado = nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1);
      
      const mockUser = {
        email: email,
        user_metadata: { full_name: nombreCapitalizado }
      };
      
      setUser(mockUser);

      // Sincronizamos con tu base de datos (Dashboard)
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!data) {
        // Es un cliente nuevo, lo registramos.
        const nuevoPerfil = {
          nombre: nombreCapitalizado,
          apellido: '', // Simulamos sin apellido
          email: email,
          rol: 'user'
        };
        
        const { data: newUser, error: insertError } = await supabase
          .from('usuarios')
          .insert([nuevoPerfil])
          .select('*')
          .single();
          
        if (!insertError) setProfile(newUser);
        else console.error("Error BD:", insertError);
      } else {
        // Ya estaba registrado
        setProfile(data);
      }
    } catch (err) {
      console.error("Error en simulación:", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Simulamos cerrar la sesión
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
