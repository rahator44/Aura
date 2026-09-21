import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    location: string;
    date: string;
    price: number;
    image: string;
}

interface BookingModalProps {
    show: boolean;
    onHide: () => void;
    event: Event;
}

const BookingModal: React.FC<BookingModalProps> = ({ show, onHide, event }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const api = new ApiClient();

    const [formData, setFormData] = useState({
        transactionId: '',
        quantity: 1,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show) {
            setFormData({
                transactionId: '',
                quantity: 1
            });
        }
    }, [show]);

    const handleQuantityChange = (change: number) => {
        const newQuantity = Math.max(1, formData.quantity + change);
        setFormData({ ...formData, quantity: newQuantity });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to book a ticket');
            onHide();
            navigate('/login');
            return;
        }

        if (!formData.transactionId) {
            toast.error('Please enter the Transaction ID');
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                event_id: event.id,
                quantity: formData.quantity,
                payment_method: 'bkash',
                transaction_id: formData.transactionId,
            };

            const response = await api.bookTicket(bookingData);
            if (response.success) {
                toast.success(response.message || 'Booking successful!');
                onHide();
            } else {
                toast.error(response.message || 'Booking failed');
            }
        } catch (_error) {
            toast.error('An error occurred during booking');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = event.price * formData.quantity;

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="booking-modal overflow-hidden">
            <Modal.Body className="p-0 overflow-hidden rounded-4 bg-dark border border-danger border-opacity-10">
                <Row className="g-0">
                    <Col md={5} className="d-none d-md-block">
                        <div
                            className="h-100 position-relative"
                            style={{
                                backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '400px'
                            }}
                        >
                            <div className="position-absolute h-100 w-100" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))' }}></div>
                            <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">
                                <h4 className="fw-bold mb-1 font-outfit">{event.title}</h4>
                                <p className="small mb-0 opacity-75">{event.location}</p>
                                <p className="small mb-0 opacity-75">{new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={7} className="p-4 p-lg-5 position-relative bg-dark text-white">
                        <button
                            onClick={onHide}
                            className="btn btn-link position-absolute top-0 end-0 mt-3 me-3 text-white opacity-50 p-0 shadow-none"
                            style={{ fontSize: '1.5rem' }}
                        >
                            <FiX />
                        </button>

                        <h4 className="fw-bold mb-4 text-glow font-outfit">Secure Checkout</h4>

                        <div className="payment-instructions-container p-4 rounded-4 mb-4" style={{ backgroundColor: '#111', border: '1px solid #dc354533' }}>
                            <div className="text-center mb-4">
                                <h6 className="text-white fw-bold mb-2 small opacity-75">Enter Transaction ID</h6>
                                <Form.Control
                                    type="text"
                                    className="input-glass text-center py-2 fs-6"
                                    placeholder="Enter Transaction ID"
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                    required
                                    style={{ border: '1px solid #dc354566' }}
                                />
                            </div>

                            <div className="p-2 mb-3 rounded bg-black bg-opacity-50 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                                <div className="small">
                                    <span className="text-red me-1">•</span>
                                    Recipient Number: <strong className="text-red">01903247467</strong>
                                </div>
                                <Button size="sm" variant="outline-danger" className="py-0 px-2 text-xs" onClick={() => { navigator.clipboard.writeText('01903247467'); toast.success('Number Copied!'); }}>
                                    Copy
                                </Button>
                            </div>

                            <ul className="list-unstyled text-light x-small opacity-75 mb-0" style={{ fontSize: '0.75rem' }}>
                                <li className="mb-2"><span className="text-red">•</span> Dial <strong className="text-warning">*247#</strong> or go to your <strong className="text-warning">bKash App</strong></li>
                                <li className="mb-2"><span className="text-red">•</span> Select the <strong className="text-warning">"Send Money"</strong> option</li>
                                <li className="mb-2"><span className="text-red">•</span> Amount to send: <strong className="text-red">{totalPrice} BDT</strong></li>
                                <li className="mb-2"><span className="text-red">•</span> Enter your <strong className="text-warning">PIN</strong> to confirm</li>
                                <li className="mb-0"><span className="text-red">•</span> Enter the <strong className="text-warning">Transaction ID</strong> above and click <strong className="text-warning">VERIFY</strong></li>
                            </ul>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Row className="align-items-center mb-4">
                                <Col xs={6}>
                                    <Form.Label className="small fw-bold text-muted text-uppercase mb-0 ls-1">Total Price</Form.Label>
                                    <div className="h4 fw-bold text-red mb-0">BDT {totalPrice}</div>
                                </Col>
                                <Col xs={6} className="text-end">
                                    <Form.Label className="small fw-bold text-muted text-uppercase d-block mb-2 ls-1">Quantity</Form.Label>
                                    <div className="d-inline-flex align-items-center bg-black rounded-pill px-3 py-1 border border-secondary border-opacity-25">
                                        <Button
                                            variant="link"
                                            className="text-white p-0 shadow-none text-decoration-none fw-bold"
                                            onClick={() => handleQuantityChange(-1)}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-3 fw-bold text-white">{formData.quantity}</span>
                                        <Button
                                            variant="link"
                                            className="text-white p-0 shadow-none text-decoration-none fw-bold"
                                            onClick={() => handleQuantityChange(1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100 py-3 rounded-pill fw-bold btn-premium animate-pulse shadow-lg"
                                disabled={loading}
                                style={{ backgroundColor: '#b00' }}
                            >
                                {loading ? <Spinner size="sm" className="me-2" /> : 'VERIFY'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default BookingModal;
