import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './view/pages/login';
import Register from './view/pages/register';
import Home from './view/pages/home';
import { MovieManagement } from './view/pages/movie_management';


function App() {
  return (
    // BrowserRouter là lớp vỏ bọc bắt buộc để bật tính năng chuyển trang
    <BrowserRouter>
      <Routes>
        {/* Định nghĩa các con đường (URL) và Component tương ứng */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin/movie" element={<MovieManagement />} />

        
        {/* Nếu người dùng gõ link bậy bạ, đẩy họ về trang chủ */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App
