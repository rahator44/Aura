import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Modal, Form, Spinner, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const api = new ApiClient();

interface BookingData {
  event_id: number;
  quantity: number;
  phone: string;
  transaction_id: string;
}

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: number;
  capacity: number;
  category?: string;
  is_featured?: boolean;
}

export default function Home() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modals state
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Form states
  const [bookingData, setBookingData] = useState<BookingData>({
    event_id: 0,
    quantity: 1,
    phone: '',
    transaction_id: ''
  });


  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const fetchEvents = async (page: number = 1) => {
    setLoading(true);
    const result = await api.getEvents(page);
    if (result.success) {
      setEvents(result.events || []);
      if (result.pagination) {
          setCurrentPage(result.pagination.current_page);
          setLastPage(result.pagination.last_page);
      }
    }
    setLoading(false);
  };

  const handleBookNow = (event: EventData) => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
    setBookingData({
      event_id: event.id,
      quantity: 1,
      phone: '',
      transaction_id: ''
    });
    setShowBooking(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await api.bookTicket(bookingData);
    if (result.success) {
      toast.success(result.message);
      setShowBooking(false);
      setBookingData({ ...bookingData, quantity: 1, phone: '', transaction_id: '' });
    } else {
      toast.error(result.message);
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('bKash number copied!');
  };

  return (
    <div className="home-page bg-black text-white min-vh-100">
      {/* Hero Section */}
      <section className="hero-section text-center d-flex align-items-center position-relative overflow-hidden" style={{
        minHeight: '85vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,1)), url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="position-absolute w-100 h-100 bg-black opacity-25"></div>
        <Container className="position-relative z-1">
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <div className="mb-4 animate-float">
                <span className="badge rounded-pill bg-danger px-4 py-2 mb-3 fw-bold">#1 EVENT PLATFORM</span>
              </div>
              <h1 className="display-1 fw-bold mb-2 animate-fade-in-up font-outfit">Experience the</h1>
              <h1 className="display-1 fw-bold text-red mb-3 animate-fade-in-up delay-100 font-outfit">Ultimate Event</h1>
              <h1 className="display-1 fw-bold mb-4 animate-fade-in-up delay-200 font-outfit">Experience</h1>
              <p className="lead mb-5 text-light opacity-75 animate-fade-in-up delay-300 mx-auto font-inter" style={{ maxWidth: '800px', fontSize: '1.25rem' }}>
                Book your tickets to the most exclusive events, concerts, and festivals.
                Join thousands of fans experiencing unforgettable moments with AURA++.
              </p>
              <div className="d-flex gap-3 justify-content-center animate-fade-in-up delay-400">
                <Button variant="danger" size="lg" className="btn-premium px-5 py-3 fw-bold" onClick={() => navigate('/events')}>
                  Explore Events
                </Button>
                <Button variant="outline-light" size="lg" className="px-5 py-3 hover-scale fw-bold" onClick={() => navigate('/about')}>
                  Learn More
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="events-section py-5">
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-end mb-5 animate-fade-in-up">
            <div>
              <h1 className="display-4 fw-bold mb-2">Upcoming <span className="text-red">Events</span></h1>
              <p className="lead text-light opacity-50">Discover and book tickets for amazing events</p>
            </div>
            {isAdmin && (
              <Button variant="danger" className="btn-premium d-none d-md-block" onClick={() => navigate('/admin')}>
                Manage Events
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <Row className="g-4">
              {events.map((event, index) => (
                <Col md={6} lg={4} key={event.id} className={`animate-fade-in-up delay-${(index % 5) * 100}`}>
                  <Card className="glass-card h-100 border-0">
                    <div className="position-relative overflow-hidden">
                      <span className="price-badge position-absolute top-0 end-0 m-3 badge rounded-pill bg-danger px-3 py-2">
                        BDT {event.price}
                      </span>
                      {event.category && (
                        <span className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-dark px-3 py-2 glassmorphism">
                          {event.category}
                        </span>
                      )}
                      <Card.Img
                        variant="top"
                        src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                        className="event-card-img"
                      />
                    </div>
                    <Card.Body className="p-4 d-flex flex-column">
                      <h4 className="fw-bold mb-3">{event.title}</h4>
                      <div className="mb-2 text-light opacity-75 d-flex align-items-center gap-2">
                        <i className="bi bi-geo-alt-fill text-red"></i> <span>{event.location}</span>
                      </div>
                      <div className="mb-2 text-light opacity-75 d-flex align-items-center gap-2">
                        <i className="bi bi-calendar-event-fill text-red"></i> <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-light opacity-50 small mb-4">
                        {event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
                      </p>
                      <Button
                        variant="danger"
                        className="btn-premium w-100 mt-auto"
                        onClick={() => handleBookNow(event)}
                      >
                        Book Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {events.length === 0 && (
                <Col className="text-center py-5">
                  <h3 className="opacity-50">No events found. Stay tuned!</h3>
                </Col>
              )}
            </Row>
          )}

          {/* Pagination */}
          {!loading && lastPage > 1 && (
            <div className="d-flex justify-content-center mt-5 animate-fade-in-up">
              <Pagination className="premium-pagination">
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="mx-1"
                >
                  <FiChevronLeft className="me-1" /> Previous
                </Pagination.Prev>
                
                {[...Array(lastPage)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className="mx-1"
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next 
                  disabled={currentPage === lastPage}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                  className="mx-1"
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
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section py-5 bg-black">
        <Container className="py-5">
          <Row className="g-4 mb-5 text-center">
            <Col md={4}>
              <Card className="border-0 p-5 glassmorphism animate-float" style={{ animationDelay: '0s' }}>
                <div className="fs-1 mb-3">😊</div>
                <h2 className="fw-bold text-red">10K+</h2>
                <p className="text-light opacity-75">Happy Customers</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 p-5 glassmorphism animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="fs-1 mb-3">🎉</div>
                <h2 className="fw-bold text-red">500+</h2>
                <p className="text-light opacity-75">Events Hosted</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 p-5 glassmorphism animate-float" style={{ animationDelay: '1s' }}>
                <div className="fs-1 mb-3">🏛️</div>
                <h2 className="fw-bold text-red">50+</h2>
                <p className="text-light opacity-75">Partner Venues</p>
              </Card>
            </Col>
          </Row>

          <div className="text-center mb-5 mt-5">
            <h2 className="display-4 fw-bold">Why Choose Us?</h2>
          </div>

          <Row className="g-4 justify-content-center">
            <Col md={6} lg={4}>
              <div className="p-5 glassmorphism h-100 text-center card-hover border-danger border-opacity-10">
                <i className="bi bi-star-fill text-red mb-4 d-block" style={{ fontSize: '3rem' }}></i>
                <h4 className="fw-bold mb-3">Exclusive Events</h4>
                <p className="opacity-50">Access to the most sought-after concerts, festivals, and elite gatherings.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="p-5 glassmorphism h-100 text-center card-hover border-danger border-opacity-10">
                <i className="bi bi-zap-fill text-red mb-4 d-block" style={{ fontSize: '3rem' }}></i>
                <h4 className="fw-bold mb-3">Instant Booking</h4>
                <p className="opacity-50">Get your tickets in seconds with our high-speed booking engine.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="p-5 glassmorphism h-100 text-center card-hover border-danger border-opacity-10">
                <i className="bi bi-shield-lock-fill text-red mb-4 d-block" style={{ fontSize: '3rem' }}></i>
                <h4 className="fw-bold mb-3">Secure Payment</h4>
                <p className="opacity-50">Your transactions are protected by industry-leading security protocols.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Booking Modal */}
      <Modal show={showBooking} onHide={() => setShowBooking(false)} centered className="modal-glass-container">
          <>
              <Modal.Header closeButton closeVariant="white" className="modal-glass border-0 px-4 pt-4">
                <Modal.Title className="fw-bold">Book Ticket: {selectedEvent?.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-glass p-4">
                <div className="payment-instructions-container p-4 rounded-4 position-relative overflow-hidden mb-4" style={{ backgroundColor: '#1a1a1a', border: '1px solid #dc354533' }}>
                  <div className="text-center mb-4">
                    <h5 className="text-white fw-bold mb-3 font-outfit">Enter Transaction ID</h5>
                    <Form.Control
                      type="text"
                      className="input-glass text-center py-3 fs-5"
                      placeholder="Enter Transaction ID"
                      value={bookingData.transaction_id}
                      onChange={(e) => setBookingData({ ...bookingData, transaction_id: e.target.value })}
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
                      <Button size="sm" variant="outline-danger" className="py-1 px-3 text-xs" onClick={() => copyToClipboard('01903247467')}>
                        Copy
                      </Button>
                    </li>
                    <li className="mb-3 d-flex align-items-start gap-2">
                      <span className="text-red fs-4">•</span>
                      <span>Amount to send: <strong className="text-red">{selectedEvent && (selectedEvent.price * bookingData.quantity)} BDT</strong></span>
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

                <Form onSubmit={handleBookingSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small text-muted text-uppercase fw-bold">Tickets Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      className="input-glass"
                      value={bookingData.quantity}
                      onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="danger" className="btn-premium w-100 py-3 fw-bold animate-pulse" style={{ backgroundColor: '#b00' }}>
                    VERIFY
                  </Button>
                </Form>
              </Modal.Body>
            </>
      </Modal>

    </div>
  );
}
