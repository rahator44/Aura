import { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';



const apiClient = new ApiClient();

export default function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Debug: Test toast on mount
    // useEffect(() => {
    //     toast('Toast system is active', { icon: '🔔' });
    // }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting registration form...", formData);

        if (formData.password !== formData.password_confirmation) {
            console.log("Password mismatch");
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Creating your account...');

        try {
            console.log("Calling API...");
            const res = await apiClient.register(
                formData.name,
                formData.email,
                formData.phone,
                formData.password,
                formData.password_confirmation
            );
            console.log("API Response:", res);

            toast.dismiss(loadingToast);

            if (res.success) {
                console.log("Registration success!");
                toast.success('Account created successfully! Please login.');
                navigate('/login');
            } else {
                console.error("Registration failed:", res.message);
                toast.error(`Error ${res.status || '?'}: ${res.message || 'Registration failed'}`);
            }
        } catch (error) {
            console.error("Catch block error:", error);
            toast.dismiss(loadingToast);
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-5">
            <Card className="card-custom p-4 text-white animate-fade-in-up" style={{ maxWidth: '500px', width: '100%', borderColor: '#222' }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-2">Join AURA++</h2>
                        <p className="text-muted">Create your account and start booking amazing events</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm your password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Check
                                type="checkbox"
                                label={
                                    <span className="text-muted">
                                        I agree to the <Link to="/terms" className="text-danger text-decoration-none">Terms & Conditions</Link> and <Link to="/privacy" className="text-danger text-decoration-none">Privacy Policy</Link>
                                    </span>
                                }
                                required
                                id="terms-check"
                            />
                        </Form.Group>

                        <Button variant="danger" type="submit" className="w-100 btn-primary-custom py-2 mb-4" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>



                        <div className="text-center mt-4 pt-3 border-top border-secondary">
                            <span className="text-muted small">Already have an account? </span>
                            <Link to="/login" className="login-link ms-1">
                                Sign In
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
