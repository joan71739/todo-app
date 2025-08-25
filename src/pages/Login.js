import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { login } from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(user, password);
            localStorage.setItem('token', res.token); // 存 token
            alert('登入成功!');
            navigate('/'); // 登入成功後跳轉到Home頁
        } catch (err) {
            setError(typeof err === 'string' ? err : (err?.message || '登入失敗，請檢查帳號或密碼是否正確'));
        }
    };


    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center bg-light"
            style={{ minHeight: '100vh' }}
        >
            <h1 className="fw-bold mb-5 mt-3 text-center text-success">任務管理系統</h1>
            <Card className="shadow w-100" style={{ maxWidth: '30rem' }}>
                <Card.Body>
                    <h3 className="mb-4 text-center">登入</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicUser">
                            <Form.Label>帳號</Form.Label>
                            <Form.Control type="text" placeholder="請輸入帳號" value={user} onChange={(e) => setUser(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>密碼</Form.Label>
                            <Form.Control type="password" placeholder="請輸入密碼" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        {error && (
                            <div className='text-danger text-center mb-3'>{error}</div>
                        )}
                        <Button variant="success" type="submit" className="w-50 d-block mx-auto">
                            登入
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Login;