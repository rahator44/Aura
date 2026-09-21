import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Container, Badge, Modal, Pagination } from 'react-bootstrap';
import { FiMapPin, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ApiClient from '../api';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    price: number;
    capacity: number;
    category: string;
    chief_guest?: string;
    tickets_sold?: number;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [bookingCount, setBookingCount] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const api = React.useMemo(() => new ApiClient(), []);

    const fetchEvents = React.useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await api.getEvents(page);
            if (response.success) {
                setEvents(response.events || []);
                if (response.pagination) {
                    setCurrentPage(response.pagination.current_page);
                    setLastPage(response.pagination.last_page);
                }
            } else {
                toast.error(response.message || 'Failed to fetch events');
            }
        } catch (_error) {
            toast.error('An error occurred while fetching events');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchEvents(currentPage);
        const fetchMyBookings = async () => {
            if (user) {
                const response = await api.getMyBookings();
                if (response.success && response.bookings) {
                    setBookingCount(response.bookings.filter((b: any) => b.status === 'confirmed').length);
                }
            }
        };
        fetchMyBookings();
    }, [fetchEvents, api, user, currentPage]);

    const DigitalClock = () => {
        const [time, setTime] = React.useState(new Date());
        React.useEffect(() => {
            const timer = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);
        return (
            <div className="digital-clock-3d shadow-lg">
                <span className="fw-bolder" style={{ fontSize: '1.6rem' }}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>
        );
    };

    const getMotivationalTheme = (id: number) => {
        const uniqueThemes = [
            'Innovate the future and connect with visionaries.',
            'Feel the rhythm and let your soul dance.',
            'Experience colors and emotions that speak louder than words.',
            'Unlock your potential and scale new heights.',
            'Step into a world of unforgettable experiences.',
            'Where ideas converge and greatness begins.',
            'Celebrate the fusion of passion and creativity.',
            'A journey into the extraordinary awaits you.',
            'Embrace the magic of the moment.',
            'Discover moments that will stay with you forever.',
            'Fuel your ambition and chase your dreams.',
            'Immerse yourself in brilliance and inspiration.',
            'Unite with fellow enthusiasts and create memories.',
            'Witness the pinnacle of human expression.',
            'Ignite your curiosity and expand your horizons.'
        ];
        return uniqueThemes[id % uniqueThemes.length];
    };

    const handleBookNow = (event: Event) => {
        setSelectedEvent(event);
        setShowBookingModal(true);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <div className="events-page py-5">
            <DigitalClock />
            <Container>
                <div className="section-header text-center mb-5">
                    <h6 className="text-danger fw-bold text-uppercase">Events</h6>
                    <h2 className="fw-bold display-5 text-white mb-4" style={{ textShadow: '0 5px 15px rgba(220,53,69,0.4)', transform: 'perspective(500px) translateZ(10px)' }}>Upcoming Events</h2>
                    
                    <div className="mb-4 d-none">
                        <DigitalClock />
                    </div>

                    <p className="text-muted mb-3">Your Gateway to Unforgettable Experiences</p>
                    {bookingCount >= 2 && (
                        <Badge bg="warning" text="dark" className="px-4 py-2 rounded-pill fw-bold shadow-sm mb-4 animate-float border-glow-red">
                            ✨ 10% ELITE MEMBER DISCOUNT ACTIVE ✨
                        </Badge>
                    )}

                    <style>
                        {`
                        @keyframes pulse {
                            0% { box-shadow: 0 0 0 0 rgba(220,53,69,0.8); }
                            70% { box-shadow: 0 0 0 10px rgba(220,53,69,0); }
                            100% { box-shadow: 0 0 0 0 rgba(220,53,69,0); }
                        }
                        `}
                    </style>


                    <div className="d-flex justify-content-center mt-3">
                        {(isAdmin || user?.is_subscribed) && (
                            <Button
                                variant="danger"
                                className="btn-premium px-4 py-2"
                                style={{ boxShadow: '0 5px 15px rgba(220,53,69,0.4)' }}
                                onClick={() => navigate('/add-event')}
                            >
                                + ADD NEW EVENT
                            </Button>
                        )}
                    </div>
                </div>

                <Row className="g-4">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <Col key={event.id} lg={4} md={6}>
                                <Card
                                    className="h-100 bg-dark text-white border-0 overflow-hidden"
                                    style={{ borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.6)', cursor: 'default', transformStyle: 'preserve-3d', transition: 'transform 0.5s ease' }}
                                    onMouseMove={(e) => {
                                        const card = e.currentTarget;
                                        const rect = card.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
                                        const centerX = rect.width / 2;
                                        const centerY = rect.height / 2;
                                        const rotateX = ((y - centerY) / centerY) * -12;
                                        const rotateY = ((x - centerX) / centerX) * 12;
                                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                                        e.currentTarget.style.transition = 'transform 0.5s ease';
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transition = 'transform 0.1s ease';
                                    }}
                                >
                                    <div className="event-image-wrapper position-relative" style={{ height: '240px', transform: 'translateZ(40px)' }}>
                                        <Card.Img
                                            variant="top"
                                            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000'}
                                            className="h-100 w-100 object-fit-cover"
                                            style={{ borderBottom: '4px solid #dc3545', filter: 'brightness(0.85)' }}
                                        />
                                        <div className="position-absolute top-0 end-0 m-3 d-flex flex-column align-items-end gap-2">
                                            {(event.id % 4 === 1 || event.id % 4 === 2) && (
                                                <Badge bg="danger" className="px-3 py-2 shadow-lg rounded-pill fw-bold text-white d-flex align-items-center" style={{ letterSpacing: '1px', fontSize: '0.9rem', animation: 'pulse 1.5s infinite' }}>
                                                    <span className="me-2 rounded-circle bg-white" style={{ width: '8px', height: '8px' }}></span>
                                                    LIVE CAST
                                                </Badge>
                                            )}
                                            <Badge bg="dark" text="light" className="px-3 py-2 shadow rounded-pill fw-bold border border-secondary" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                                                {event.category || 'General'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Card.Body className="d-flex flex-column p-4 p-xl-5" style={{ transform: 'translateZ(60px)' }}>
                                        <Card.Title className="fw-bolder mb-1 h3 text-white" style={{ letterSpacing: '0.5px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{event.title}</Card.Title>

                                        <p className="text-danger mb-4 fst-italic" style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                                            "{getMotivationalTheme(event.id)}"
                                        </p>

                                        <div className="event-info text-light mb-4 flex-grow-1" style={{ opacity: 0.85 }}>
                                            <div className="d-flex align-items-center mb-3">
                                                <FiMapPin className="text-danger me-3 fs-5" />
                                                <span className="fw-medium" style={{ fontSize: '1.05rem' }}>{event.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <FiCalendar className="text-danger me-3 fs-5" />
                                                <span className="fw-medium" style={{ fontSize: '1.05rem' }}>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <FiClock className="text-danger me-3 fs-5" />
                                                <span className="fw-medium" style={{ fontSize: '1.05rem' }}>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-auto border-top border-secondary border-opacity-50" style={{ transform: 'translateZ(20px)' }}>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <span className="text-muted text-uppercase small fw-bold" style={{ letterSpacing: '1px' }}>Ticket Price</span>
                                                <h4 className="fw-bold text-white mb-0" style={{ textShadow: '0 2px 5px rgba(220,53,69,0.5)' }}>
                                                    <span className="text-danger me-1 h5">BDT</span>{event.price}
                                                </h4>
                                            </div>
                                            <div className="d-flex gap-3">
                                                <Button
                                                    variant="outline-danger"
                                                    className="w-50 rounded-pill fw-bold py-2 shadow-sm"
                                                    style={{ transition: 'all 0.3s', borderWidth: '2px' }}
                                                    onClick={() => { setSelectedEvent(event); setShowDetailsModal(true); }}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="w-50 rounded-pill fw-bold py-2 shadow-sm"
                                                    style={{ transition: 'all 0.3s' }}
                                                    onClick={() => handleBookNow(event)}
                                                >
                                                    {(event.id % 4 === 1 || event.id % 4 === 2) ? 'Join Live Cast' : 'Buy Ticket'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <h3 className="text-muted">No events found</h3>
                        </Col>
                    )}
                </Row>

                {lastPage > 1 && (
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination className="premium-pagination">
                            <Pagination.Prev 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                <FiChevronLeft className="me-1" /> Previous
                            </Pagination.Prev>
                            
                            {[...Array(lastPage)].map((_, idx) => (
                                <Pagination.Item
                                    key={idx + 1}
                                    active={idx + 1 === currentPage}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next 
                                disabled={currentPage === lastPage}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next <FiChevronRight className="ms-1" />
                            </Pagination.Next>
                        </Pagination>

                        <style>
                            {`
                            .premium-pagination .page-link {
                                background: #1a1a1a;
                                border: 1px solid #333;
                                color: #fff;
                                padding: 10px 20px;
                                margin: 0 5px;
                                border-radius: 8px;
                                transition: all 0.3s ease;
                                font-weight: 600;
                            }
                            .premium-pagination .page-item.active .page-link {
                                background: #dc3545;
                                border-color: #dc3545;
                                color: #fff;
                                box-shadow: 0 5px 15px rgba(220,53,69,0.4);
                            }
                            .premium-pagination .page-link:hover {
                                background: #2d2d2d;
                                border-color: #dc3545;
                                color: #dc3545;
                            }
                            .premium-pagination .page-item.disabled .page-link {
                                background: #111;
                                border-color: #222;
                                color: #444;
                            }
                            `}
                        </style>
                    </div>
                )}
            </Container>

            {showBookingModal && selectedEvent && (
                <PaymentModal
                    show={showBookingModal}
                    onHide={() => setShowBookingModal(false)}
                    event={selectedEvent}
                    isMember={bookingCount >= 2}
                />
            )}

            {selectedEvent && (
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                    <Modal.Header closeButton className="bg-dark text-white border-bottom border-danger" closeVariant="white">
                        <Modal.Title className="fw-bold">{selectedEvent.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-white p-4">
                        <Row>
                            <Col md={5}>
                                <img src={selectedEvent.image} alt={selectedEvent.title} className="img-fluid rounded-3 mb-3 shadow-lg" style={{ border: '2px solid #dc3545', maxHeight: '250px', width: '100%', objectFit: 'cover' }} />
                                <div className="p-3 bg-gradient bg-danger bg-opacity-10 border border-danger rounded-3 text-center mb-3">
                                    <h6 className="text-danger fw-bold mb-1 text-uppercase">Tickets Sold Till Now</h6>
                                    <h3 className="fw-bolder text-white mb-0">{selectedEvent.tickets_sold || 0} <span className="text-muted fs-6 fw-normal">/ {selectedEvent.capacity}</span></h3>
                                </div>
                                <div className="text-center mt-3">
                                    <Badge bg="success" className="p-2 w-100 fw-bold shadow-sm" style={{ letterSpacing: '1px' }}>
                                        ✓ Premium Subscriber Verified
                                    </Badge>
                                </div>
                            </Col>
                            <Col md={7}>
                                <h4 className="fw-bold text-danger mb-3">About The Event</h4>
                                <p className="text-light text-opacity-75" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>{selectedEvent.description}</p>

                                {selectedEvent.chief_guest && (
                                    <div className="mt-4 p-3 bg-light bg-opacity-10 rounded-3 border-start border-4 border-danger">
                                        <h5 className="fw-bold text-white mb-1">Chief Guest</h5>
                                        <h4 className="text-danger fw-bolder mb-0" style={{ letterSpacing: '0.5px' }}>★ {selectedEvent.chief_guest} ★</h4>
                                    </div>
                                )}

                                <div className="event-info text-light mt-4 pt-4 border-top border-secondary border-opacity-50">
                                    <div className="d-flex align-items-center mb-2">
                                        <FiMapPin className="text-danger me-3 fs-5" />
                                        <span className="fw-medium text-opacity-75">{selectedEvent.location}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <FiCalendar className="text-danger me-3 fs-5" />
                                        <span className="fw-medium text-opacity-75">{new Date(selectedEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="bg-dark border-top border-secondary">
                        <Button variant="outline-light" onClick={() => setShowDetailsModal(false)}>Close</Button>
                        <Button variant="danger" className="fw-bold px-4 shadow" onClick={() => { setShowDetailsModal(false); setShowBookingModal(true); }}>
                            Buy Ticket Now
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Events;
