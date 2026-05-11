// src/pages/Register.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // 1. Tạo các biến State để quản lý dữ liệu nhập vào
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [full_name, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State quản lý thông báo lỗi hoặc thành công
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // 2. Hàm xử lý khi bấm nút Đăng ký
  const handleRegister = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn F5 trang
    
    // Reset các thông báo cũ
    setError('');
    setSuccess('');

    // Kiểm tra nhanh ở Frontend trước khi gọi API để tiết kiệm tài nguyên
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return; // Dừng hàm lại ngay lập tức
    }

    try {
      // GỌI API BACKEND: Đổi URL này cho khớp với router FastAPI của bạn
      const response = await axios.post('http://localhost:8000/api/v1/users/signup', {
        username: username,
        password: password,
        email: email,
        phone_number: phone_number,
        full_name: full_name
      });

      if (response.data.status=="success"){
        setSuccess('Đăng ký thành công! Đang chuyển hướng về trang Đăng nhập...');
        // Đợi 2 giây cho user đọc chữ "Thành công" rồi mới đá về trang Login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      else{
        alert("Đăng kí thất bại, lỗi ở server")
      }

      // Nếu Backend trả về thành công (HTTP 200/201)
      
      
      
    } catch (err: any) {
      // Bắt lỗi từ Backend (ví dụ: Tên đăng nhập đã tồn tại)
      setError(err.response?.data?.detail || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Tạo Tài Khoản Mới</h2>
      
      {/* Nơi hiển thị thông báo Lỗi (Màu đỏ) hoặc Thành công (Màu xanh) */}
      {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: '#4ade80', textAlign: 'center' }}>{success}</p>}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
        
        <div>
          <label>Họ và tên</label>
          <input 
            type="text" 
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
            disabled={!!success}
          />
        </div>
        
        <div>
          <label>Tên đăng nhập</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
            disabled={!!success} // Nếu đăng ký thành công thì khóa ô nhập lại
          />
        </div>

        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
            disabled={!!success}
          />
        </div>

        <div>
          <label>Số điện thoại</label>
          <input 
            type="text" 
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
            disabled={!!success}
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
            disabled={!!success}
          />
        </div>

        <div>
          <label>Xác nhận Mật khẩu</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            required
            disabled={!!success}
          />
        </div>

        <button 
          type="submit" 
          disabled={!!success} // Khóa nút khi đang hiện thông báo thành công
          style={{ 
            padding: '12px', 
            backgroundColor: success ? '#6b7280' : '#3b82f6', // Đổi màu xám nếu bị khóa
            color: 'white', 
            border: 'none', 
            cursor: success ? 'not-allowed' : 'pointer' 
          }}>
          Đăng ký
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Đã có tài khoản? <Link to="/login" style={{ color: '#60a5fa' }}>Đăng nhập ngay</Link>
      </p>
    </div>
  );
}