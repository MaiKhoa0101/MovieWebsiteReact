// src/pages/Login.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  // 1. Tạo State để lưu trữ những gì người dùng gõ vào
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Hook của React Router dùng để chuyển trang bằng code
  const navigate = useNavigate();

  // 2. Hàm xử lý khi bấm nút Đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt tự động F5 lại trang khi submit form
    setError('');

    try {
      // GỌI API BACKEND: Thay URL này bằng đường dẫn API FastAPI của bạn
      const response = await axios.post('http://localhost:8000/api/v1/users/login', {
        username: username,
        password: password
      });

      // 3. Nếu thành công, Backend sẽ trả về token. 
      const token = response.data.access_token; // Tùy cấu trúc JSON BE trả về

      // Lưu token vào LocalStorage (Két sắt của trình duyệt)
      localStorage.setItem('auth_token', token);

      // Chuyển hướng cái vèo sang trang chủ
      navigate('/');
      
    } catch (err: any) {
      // Nếu Backend báo lỗi (sai pass, user ko tồn tại...)
      setError(err.response?.data?.detail || "Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Đăng Nhập</h2>
      
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px',padding: '40px' }}>
        <div>
          <label>Tên đăng nhập</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Cập nhật state mỗi khi gõ phím
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
          />
        </div>
        
        <div>
          <label>Mật khẩu</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>
          Đăng nhập
        </button>
      </form>

      {/* Component Link dùng để chuyển trang mà KHÔNG làm F5 lại web */}
      {/* <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Chưa có tài khoản? <Link to="/register" style={{ color: '#60a5fa' }}>Đăng ký ngay</Link>
      </p> */}
    </div>
  );
}