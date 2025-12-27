import { Routes, Route } from "react-router-dom";

// Customer Pages
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Item from "./pages/Item/Item";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import News from "./pages/News/News";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AddProduct from "./pages/Admin/AddProduct/AddProduct";
import EditProducts from "./pages/Admin/EditProducts/EditProducts";
import AddImage from "./pages/Admin/AddImage/AddImage";
import ManageGallery from "./pages/Admin/ManageGallery/ManageGallery";
import AdminNews from "./pages/Admin/AdminNews/AdminNews";

function App() {
  return (
    <Routes>
      {/* Customer pages */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<Item />} /> 
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/news" element={<News />} />

      {/* Admin pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/edit-products/:id" element={<EditProducts />} />
      <Route path="/admin/add-image" element={<AddImage />} />
      <Route path="/admin/manage-gallery" element={<ManageGallery />} />
      <Route path="/admin/manage-news" element={<AdminNews />} />
    </Routes>
  );
}

export default App;
