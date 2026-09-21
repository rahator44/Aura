import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const apiClient = new ApiClient();

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Sending reset code...');

        try {
            const res = await apiClient.forgotPassword(email);
            toast.dismiss(loadingToast);

            if (res.success) {
                toast.success(res.message);
                // In simulation, we show the code in an alert so the user can see it
                if (res.simulated_code) {
                    alert(`[SIMULATION] Your reset code is: ${res.simulated_code}`);
                }
                navigate('/reset-password', { state: { email } });
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark py-5 px-3">
            <Container style={{ maxWidth: '450px' }}>
                <Link to="/login" className="text-secondary text-decoration-none d-inline-flex align-items-center mb-4 hover-translate-x">
                    <FaArrowLeft className="me-2" /> Back to Login
                </Link>

                <Card className="border-0 shadow-lg overflow-hidden bg-dark text-white border border-secondary border-opacity-25 animated-border">
                    <Card.Body className="p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 mb-3">
                                <FaEnvelope className="text-danger" size={30} />
                            </div>
                            <h3 className="fw-bold fs-4">Forgot Password?</h3>
                            <p className="text-secondary small">
                                No worries! Enter your email and we'll send you a reset code.
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-dark text-white border-secondary py-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100 py-2 fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default ForgotPassword;
