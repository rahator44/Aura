import { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const apiClient = new ApiClient();

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await apiClient.login(email, password);
            if (res.success) {
                toast.success('Logged in successfully!');
                login(res.user, res.access_token);
                navigate('/');
            } else {
                toast.error(`Error ${res.status || '?'}: ${res.message || 'Login failed'}`);
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="card-custom p-4 text-white animate-fade-in-up" style={{ maxWidth: '450px', width: '100%', borderColor: '#222' }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-2">Welcome Back</h2>
                        <p className="text-muted">Login to access your <span className="text-red">AURA++</span> account</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-4 text-sm">
                            <Form.Check
                                type="checkbox"
                                label="Remember me"
                                className="text-muted"
                                id="custom-switch"
                            />
                            <Link to="/forgot-password" style={{ color: '#D90429', textDecoration: 'none' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button variant="danger" type="submit" className="w-100 btn-primary-custom py-2 mb-4" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>



                        <div className="text-center">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/register" style={{ color: '#D90429', textDecoration: 'none', fontWeight: 'bold' }}>
                                Register here
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container >
    );
}
