import { Container, Card } from 'react-bootstrap';

export default function Terms() {
    return (
        <Container className="py-5" style={{ maxWidth: '950px' }}>
            <Card className="p-5 bg-dark text-white border-0 shadow-lg" style={{
                borderRadius: '30px',
                background: 'rgba(20, 20, 20, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Card.Body>
                    <h1 className="text-center mb-2 fw-bold" style={{ letterSpacing: '4px', color: '#D90429', fontSize: '3rem', textShadow: '0 0 20px rgba(217, 4, 41, 0.3)' }}>
                        TERMS & CONDITIONS
                    </h1>
                    <p className="text-white text-center mb-5 fw-bold opacity-50">Last Updated: February 16, 2026</p>

                    <section className="mb-5">
                        <div className="rules-list mt-4">
                            <ul className="list-unstyled">
                                <li className="mb-5 p-4 rounded shadow-lg" style={{ background: '#111', borderLeft: '8px solid #D90429' }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <span style={{
                                            background: '#D90429',
                                            padding: '8px 15px',
                                            borderRadius: '6px',
                                            fontWeight: '800',
                                            fontSize: '0.9rem',
                                            marginRight: '20px',
                                            boxShadow: '0 4px 15px rgba(217, 4, 41, 0.4)'
                                        }}>REQUIRED</span>
                                        <h3 className="fw-bold mb-0 text-white" style={{ fontSize: '1.6rem' }}>💳 Payment Confirmation</h3>
                                    </div>
                                    <p className="text-white ms-0" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
                                        All tickets must be <span style={{ background: 'rgba(217, 4, 41, 0.2)', padding: '2px 8px', borderRadius: '4px', color: '#ff4d4d', fontWeight: '700', borderBottom: '2px solid #D90429' }}>PAID IN FULL</span> at booking. You will only be issued a valid ticket after the transaction is confirmed.
                                    </p>
                                </li>

                                <li className="mb-5 p-4 rounded shadow-lg" style={{ background: '#111', borderLeft: '8px solid #FFC107' }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <span style={{
                                            background: '#FFC107',
                                            padding: '8px 15px',
                                            borderRadius: '6px',
                                            fontWeight: '800',
                                            fontSize: '0.9rem',
                                            marginRight: '20px',
                                            color: '#000',
                                            boxShadow: '0 4px 15px rgba(255, 193, 7, 0.4)'
                                        }}>STRICT POLICY</span>
                                        <h3 className="fw-bold mb-0 text-white" style={{ fontSize: '1.6rem' }}>🚫 Non-Refundable Policy</h3>
                                    </div>
                                    <p className="text-white ms-0" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
                                        If you book a ticket and fail to attend, <span style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '2px 8px', borderRadius: '4px', color: '#FFC107', fontWeight: '700', borderBottom: '2px solid #FFC107' }}>NO REFUND</span> is provided. Attendance is the responsibility of the ticket holder.
                                    </p>
                                </li>

                                <li className="mb-5 p-4 rounded shadow-lg" style={{ background: '#111', borderLeft: '8px solid #17A2B8' }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <span style={{
                                            background: '#17A2B8',
                                            padding: '8px 15px',
                                            borderRadius: '6px',
                                            fontWeight: '800',
                                            fontSize: '0.9rem',
                                            marginRight: '20px',
                                            boxShadow: '0 4px 15px rgba(23, 162, 184, 0.4)'
                                        }}>VALID ID</span>
                                        <h3 className="fw-bold mb-0 text-white" style={{ fontSize: '1.6rem' }}>🆔 Identity Verification</h3>
                                    </div>
                                    <p className="text-white ms-0" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
                                        You MUST bring your <span className="fw-bold text-info">ORIGINAL ID PROOF</span>. Digital copies or photos on mobile phones will NOT be accepted at the entry gate.
                                    </p>
                                </li>

                                <li className="mb-5 p-4 rounded shadow-lg" style={{ background: '#111', borderLeft: '8px solid #00d4ff' }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <span style={{
                                            background: '#00d4ff',
                                            padding: '8px 15px',
                                            borderRadius: '6px',
                                            fontWeight: '800',
                                            fontSize: '0.9rem',
                                            marginRight: '20px',
                                            color: '#000',
                                            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)'
                                        }}>GATE CLOSE</span>
                                        <h3 className="fw-bold mb-0 text-white" style={{ fontSize: '1.6rem' }}>🕒 Entry Deadline</h3>
                                    </div>
                                    <p className="text-white ms-0" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
                                        Entry is <span className="fw-bold text-danger">STRICTLY PROHIBITED</span> after the event start time. No entry or refund will be given for late arrivals.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mt-5 p-5 rounded text-center" style={{ background: 'linear-gradient(rgba(217, 4, 41, 0.1), transparent)', border: '2px solid rgba(217, 4, 41, 0.3)' }}>
                        <h4 className="fw-bold mb-4" style={{ color: '#D90429', letterSpacing: '2px' }}>⚠️ SAFETY & CONDUCT</h4>
                        <p className="text-white fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
                            Violation of event rules or any harassment will result in <span style={{ color: '#D90429', textDecoration: 'underline' }}>IMMEDIATE REMOVAL</span> without refund and a lifetime ban from AURA++.
                        </p>
                    </section>

                    <div className="text-center mt-5 pt-4 border-top border-secondary">
                        <p className="small text-white opacity-50 mb-0">© 2026 AURA++ Ticket Booking System. All Rights Reserved.</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
