import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../../../viewmodel/AuthViewModel';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const authvm = useAuthViewModel();
  const user = authvm.user
  if (user){
    navigate("/")
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Đăng Nhập</h2>

      {authvm.error && <p style={{ color: '#ef4444' }}>{authvm.error}</p>}

      <form onSubmit={(e) => authvm.handleLogin(email, password, e)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '40px' }}>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật state mỗi khi gõ phím
            style=  {{ width: '100%', padding: '10px', marginTop: '5px' }}
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