import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <Routes>
            {/* Public Site */}
            <Route path="/" element={<HomePage />} />

            {/* Admin Portal */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-product" element={<AdminAddProduct />} />
              <Route path="/admin/edit-product/:id" element={<AdminAddProduct />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
            </Route>
          </Routes>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
