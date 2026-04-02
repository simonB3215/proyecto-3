import fs from 'fs';

const images = {
  'electronica.jpg': 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
  'ropa.jpg': 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
  'polera.jpg': 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
  'polerones.jpg': 'https://fakestoreapi.com/img/71li-ujtlVG._AC_UX679_.jpg',
  'pantalones.jpg': 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
  'calzado.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Zapatos.jpg',
  'hogar.jpg': 'https://fakestoreapi.com/img/81Zt42O02K._AC_SX679_.jpg',
  'deportes.jpg': 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  'default.jpg': 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
};

const dl = async () => {
    fs.mkdirSync('./public/placeholders', { recursive: true });
    for (const [key, url] of Object.entries(images)) {
        try {
            console.log("Downloading", key);
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!res.ok) throw new Error("Failed " + res.status);
            const buf = await res.arrayBuffer();
            fs.writeFileSync('./public/placeholders/' + key, Buffer.from(buf));
            console.log("Saved", key);
        } catch(e) {
            console.error("Error with", key, e.message);
        }
    }
}
dl();
