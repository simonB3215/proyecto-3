import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <ShopProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Layout>
      </Router>
    </ShopProvider>
  );
}

export default App;
