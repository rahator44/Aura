import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const apiClient = new ApiClient();

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        code: '',
        password: '',
        password_confirmation: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true);
        const loadingToast = toast.loading('Resetting your password...');

        try {
            const res = await apiClient.resetPassword(formData);
            toast.dismiss(loadingToast);

            if (res.success) {
                toast.success('Password reset successful! You can now log in.');
                navigate('/login');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark py-5 px-3">
            <Container style={{ maxWidth: '450px' }}>
                <Card className="border-0 shadow-lg overflow-hidden bg-dark text-white border border-secondary border-opacity-25 animated-border">
                    <Card.Body className="p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 mb-3">
                                <FaKey className="text-danger" size={30} />
                            </div>
                            <h3 className="fw-bold fs-4">Reset Password</h3>
                            <p className="text-secondary small">
                                We've sent a 6-digit code to <strong>{formData.email}</strong>
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="small fw-semibold text-secondary">Verify Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-dark text-white border-secondary"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="code">
                                <Form.Label className="small fw-semibold text-secondary">6-Digit Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="bg-dark text-white border-secondary text-center fs-4 fw-bold letter-spacing-wide"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="small fw-semibold text-secondary">New Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-dark border-secondary text-secondary">
                                        <FaLock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        className="bg-dark text-white border-secondary py-2"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        className="border-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="confirmPassword">
                                <Form.Label className="small fw-semibold text-secondary">Confirm New Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-dark border-secondary text-secondary">
                                        <FaLock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Repeat your password"
                                        className="bg-dark text-white border-secondary py-2"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100 py-2 fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Reset Password'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <Link to="/forgot-password" title="Retry" className="text-secondary text-decoration-none small">
                                Didn't receive a code? Try again
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default ResetPassword;
