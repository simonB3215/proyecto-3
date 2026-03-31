import { createClient } from '@supabase/supabase-js';

const url = 'https://ogvodvqtlvutxhipvoca.supabase.co';
const key = 'sb_publishable_LC0l8QmWH4WbmRHdBcf-tQ_cXUakpjT';

const supabase = createClient(url, key);

async function check() {
  console.log("Checking tables...");
  
  const { data: productos, error: err1 } = await supabase.from('productos').select('*').limit(1);
  if (err1) {
    console.error("Error productos:", err1.message, err1.details, err1.hint);
  } else {
    console.log("Productos OK:", productos);
  }

  const { data: usuarios, error: err2 } = await supabase.from('usuarios').select('*').limit(1);
  if (err2) {
    console.error("Error usuarios:", err2.message, err2.details, err2.hint);
  } else {
    console.log("Usuarios OK:", usuarios);
  }
}

check();
