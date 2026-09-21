import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ApiClient from '../api';

interface Event {
    id: number;
    title: string;
    date: string;
    price: number;
}

interface PaymentModalProps {
    show: boolean;
    onHide: () => void;
    event: Event;
    isMember?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ show, onHide, event, isMember }) => {
    const [quantity, setQuantity] = useState(1);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: ''
    });
    const api = new ApiClient();

    const discount = isMember ? 0.1 : 0;
    const basePrice = event.price * quantity;
    const totalPrice = basePrice * (1 - discount);

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const bookingData = {
            event_id: event.id,
            quantity: quantity,
            payment_method: 'bkash',
            transaction_id: cardData.number, // Reusing cardData.number as the transaction ID input
            total_price: totalPrice
        };

        try {
            const response = await api.bookTicket(bookingData);
            if (response.success) {
                toast.success(response.message || 'Booking Successful!');
                onHide();
            } else {
                toast.error(response.message || 'Payment Failed');
            }
        } catch (error) {
            toast.error('An error occurred during payment');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="payment-modal">
            <Modal.Header className="bg-dark border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <Modal.Title className="text-white fw-bold h4">Confirm Booking & Payment</Modal.Title>
                <FiX className="text-white cursor-pointer fs-4" onClick={onHide} />
            </Modal.Header>
            <Modal.Body className="bg-dark p-4">
                    <>
                        <div className="event-summary-card mb-4 p-4 rounded-4" style={{ backgroundColor: '#0f0f0f', border: '1px solid #222' }}>
                            <h5 className="text-red fw-bold mb-1 font-outfit">{event.title}</h5>
                            <p className="text-muted small mb-4">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-white fw-bold">Number of Tickets</span>
                                <div className="quantity-selector d-flex align-items-center bg-dark rounded-pill p-1 border border-secondary border-opacity-25">
                                    <Button variant="link" className="text-white p-2" onClick={() => handleQuantityChange(-1)}><FiMinus /></Button>
                                    <span className="px-3 fw-bold text-white">{quantity}</span>
                                    <Button variant="link" className="text-white p-2" onClick={() => handleQuantityChange(1)}><FiPlus /></Button>
                                </div>
                            </div>
                            <hr className="border-secondary border-opacity-25 my-4" />
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small">Base Price</span>
                                <span className="text-white small">BDT {basePrice}</span>
                            </div>
                            {isMember && (
                                <div className="d-flex justify-content-between align-items-center mb-2 animate-fade-in">
                                    <span className="text-warning small fw-bold">Elite Membership Discount (10%)</span>
                                    <span className="text-warning small fw-bold">- BDT {basePrice * 0.1}</span>
                                </div>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small">Total Price</span>
                                <span className="text-red fw-bold h3 mb-0">BDT {totalPrice}</span>
                            </div>
                        </div>

                        <div className="payment-instructions-container p-4 rounded-4 position-relative overflow-hidden mb-4" style={{ backgroundColor: '#1a1a1a', border: '1px solid #dc354533' }}>
                            <div className="text-center mb-4">
                                <h5 className="text-white fw-bold mb-3 font-outfit">Enter Transaction ID</h5>
                                <Form.Control
                                    type="text"
                                    className="input-glass text-center py-3 fs-5"
                                    placeholder="Enter Transaction ID"
                                    value={cardData.number} 
                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                                    required
                                    style={{ letterSpacing: '2px', border: '2px solid #dc354544' }}
                                />
                            </div>

                            <ul className="list-unstyled text-light small opacity-90 mb-0">
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="text-red fs-4">•</span>
                                    <span>Dial <strong className="text-warning">*247#</strong> or open your <strong className="text-warning">bKash App</strong>.</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="text-red fs-4">•</span>
                                    <span>Select the <strong className="text-warning">"Send Money"</strong> option.</span>
                                </li>
                                <li className="mb-3 d-flex align-items-center justify-content-between gap-2 p-2 rounded bg-black bg-opacity-50 border border-secondary border-opacity-25">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-red fs-4">•</span>
                                        <span>Enter this recipient number: <strong className="text-red fs-5">01903247467</strong></span>
                                    </div>
                                    <Button size="sm" variant="outline-danger" className="py-1 px-3 text-xs" onClick={() => { navigator.clipboard.writeText('01903247467'); toast.success('Number Copied!'); }}>
                                        Copy
                                    </Button>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="text-red fs-4">•</span>
                                    <span>Amount to send: <strong className="text-red">{totalPrice} BDT</strong></span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="text-red fs-4">•</span>
                                    <span>Enter your <strong className="text-warning">bKash PIN</strong> to confirm the transaction.</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <span className="text-red fs-4">•</span>
                                    <span>You will receive a confirmation message with a <strong className="text-warning">Transaction ID</strong>.</span>
                                </li>
                                <li className="mb-0 d-flex align-items-start gap-2">
                                    <span className="text-red fs-4">•</span>
                                    <span>Enter the ID in the box above and click <strong className="text-warning">VERIFY</strong>.</span>
                                </li>
                            </ul>
                        </div>

                        <Form onSubmit={handlePayment}>
                            <Button type="submit" variant="danger" className="btn-premium w-100 py-3 fw-bold fs-5 shadow-lg animate-pulse" style={{ backgroundColor: '#b00' }}>
                                VERIFY
                            </Button>
                        </Form>
                    </>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;
