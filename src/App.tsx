import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/view/login';
import Register from './features/auth/view/register';
import Home from './features/home/view/home/home';
import { MovieManagement } from './features/movies/view/pages/admin/movie_management';
import DetailMovie from './features/movies/view/pages/detail_movie/detail_movie';
import SubscriptionPage from './features/subscription/view/subscription_page';


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
        <Route path="/detail/:slug" element={<DetailMovie />} />
        <Route path="/subscription" element={<SubscriptionPage />} />

        {/* Nếu người dùng gõ link bậy bạ, đẩy họ về trang chủ */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App
