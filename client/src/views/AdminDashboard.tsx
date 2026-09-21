import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaPowerOff, FaTrash, FaUserShield } from 'react-icons/fa';
import ApiClient from '../api';
import toast from 'react-hot-toast';

const api = new ApiClient();

interface Stats {
    total_users: number;
    total_events: number;
    total_bookings: number;
    total_revenue: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
    deleted_at?: string | null;
}

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    capacity: number;
    category?: string;
    image?: string;
}

interface Booking {
    id: number;
    user_id: number;
    event_id: number;
    quantity: number;
    total_price: number;
    status: string;
    user?: User;
    event?: Event;
    created_at: string;
}

interface SubscriptionData {
    id: number;
    user_id: number;
    email: string;
    transaction_id: string;
    amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    user?: User;
}

const AdminDashboard: React.FC = () => {
    console.log("[ADMIN] Mounting AdminDashboard...");
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'events' | 'tickets' | 'subscriptions'>('users');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '',
        capacity: '',
        image: ''
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        console.log("[ADMIN] useEffect triggered");
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (isManual = false) => {
        console.log("[ADMIN] Fetching data...");
        if (isManual) setRefreshing(true);
        else setLoading(true);

        try {
            const [statsRes, usersRes, eventsRes, bookingsRes] = await Promise.all([
                api.getAdminStats(),
                api.getAdminUsers(),
                api.getEvents(),
                api.getAllBookings(),
            ]);

            console.log("[ADMIN] Stats Response:", statsRes);
            console.log("[ADMIN] Users Response:", usersRes);
            console.log("[ADMIN] Events Response:", eventsRes);
            console.log("[ADMIN] Bookings Response:", bookingsRes);

            if (statsRes.success) {
                setStats(statsRes.data || null);
            } else {
                toast.error("Format error in stats response");
            }

            if (usersRes.success) {
                setUsers(usersRes.data || []);
            } else {
                toast.error(`Fetch Users Error: ${usersRes.message || 'Unknown error'}`);
            }

            if (eventsRes.success) {
                setEvents(eventsRes.events || []);
            }
            if (bookingsRes.success) {
                setBookings(bookingsRes.bookings || []);
            }

            if (isManual && usersRes.success) {
                toast.success("Dashboard data refreshed!");
            }
        } catch (err: any) {
            console.error("[ADMIN] Data Fetch Error:", err);
            toast.error(`Network Error: ${err.message || "Failed to load dashboard data"}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }

        // Fetch subscriptions separately so it never blocks other data
        try {
            const subsRes = await api.getAdminSubscriptions();
            console.log("[ADMIN] Subs Response:", subsRes);
            if (subsRes.success) {
                setSubscriptions((subsRes as any).subscriptions || []);
            }
        } catch (err: any) {
            console.error("[ADMIN] Subscriptions fetch error:", err);
        }
    };

    const handleToggleStatus = async (userId: number) => {
        const res = await api.toggleUserStatus(userId);
        if (res.success) {
            toast.success(res.message);
            fetchDashboardData(true);
        } else {
            toast.error(res.message);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to suspend this user?')) {
            const res = await api.deleteUser(userId);
            if (res.success) {
                toast.success(res.message);
                fetchDashboardData(true);
            } else {
                toast.error(res.message);
            }
        }
    };

    const handleAcceptSubscription = async (id: number) => {
        if (window.confirm('Are you sure you want to approve this subscription? An email will be sent to the user immediately.')) {
            const res = await api.acceptSubscription(id);
            if (res.success) {
                toast.success(res.message);
                fetchDashboardData(true);
            } else {
                toast.error(res.message);
            }
        }
    };

    const handleRejectSubscription = async (id: number) => {
        if (window.confirm('Are you sure you want to reject this subscription? An email will be sent to the user.')) {
            const res = await api.rejectSubscription(id);
            if (res.success) {
                toast.success(res.message);
                fetchDashboardData(true);
            } else {
                toast.error(res.message);
            }
        }
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await api.createEvent({
                ...newEvent,
                price: Number(newEvent.price),
                capacity: Number(newEvent.capacity)
            });
            if (res.success) {
                toast.success('Event created successfully!');
                setShowAddEventModal(false);
                setNewEvent({ title: '', description: '', date: '', location: '', price: '', capacity: '', image: '' });
                fetchDashboardData(true);
            } else {
                toast.error(res.message || 'Failed to create event');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setCreating(false);
        }
    };

    if (loading && !refreshing) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="danger" />
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white mb-0 fw-bold">Admin Dashboard</h2>
                <div className="d-flex gap-2">
                    <Button
                        variant="danger"
                        onClick={() => setShowAddEventModal(true)}
                        className="d-flex align-items-center gap-2"
                    >
                        <FaCalendarAlt /> Add Event
                    </Button>
                    <Button
                        variant="outline-danger"
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                        className="d-flex align-items-center gap-2"
                    >
                        {refreshing ? <Spinner size="sm" /> : <FaPowerOff style={{ transform: 'rotate(90deg)' }} />}
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                </div>
            </div>

            <Row className="mb-5 g-3">
                <Col md={3} onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }}>
                    <Card className={`h-100 bg-dark text-white shadow-sm ${activeTab === 'users' ? 'border-primary' : 'border-secondary'}`}>
                        <Card.Body className="d-flex align-items-center p-3">
                            <div className="bg-primary p-2 rounded-3 me-3">
                                <FaUsers size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold text-primary">Users: {stats?.total_users || 0}</h6>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} onClick={() => setActiveTab('events')} style={{ cursor: 'pointer' }}>
                    <Card className={`h-100 bg-dark text-white shadow-sm ${activeTab === 'events' ? 'border-success' : 'border-secondary'}`}>
                        <Card.Body className="d-flex align-items-center p-3">
                            <div className="bg-success p-2 rounded-3 me-3">
                                <FaCalendarAlt size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold text-success">Events: {stats?.total_events || 0}</h6>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} onClick={() => setActiveTab('tickets')} style={{ cursor: 'pointer' }}>
                    <Card className={`h-100 bg-dark text-white shadow-sm ${activeTab === 'tickets' ? 'border-warning' : 'border-secondary'}`}>
                        <Card.Body className="d-flex align-items-center p-3">
                            <div className="bg-warning p-2 rounded-3 me-3">
                                <FaTicketAlt size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold text-warning">Bookings: {stats?.total_bookings || 0}</h6>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} onClick={() => setActiveTab('subscriptions')} style={{ cursor: 'pointer' }}>
                    <Card className={`h-100 bg-dark text-white shadow-sm ${activeTab === 'subscriptions' ? 'border-info' : 'border-secondary'}`}>
                        <Card.Body className="d-flex align-items-center p-3">
                            <div className="bg-info p-2 rounded-3 me-3 text-dark">
                                <FaUserShield size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold text-info">Subscriptions: {subscriptions.length}</h6>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Content Based on Active Tab */}
            <Card className="bg-dark text-white border-secondary shadow-sm">
                <Card.Header className="bg-transparent border-secondary py-3">
                    <h5 className="mb-0 fw-bold">
                        {activeTab === 'users' ? 'User Management' : activeTab === 'events' ? 'Event Details' : activeTab === 'subscriptions' ? 'Subscription Requests' : 'Ticket Sales (Bookings)'}
                    </h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover variant="dark" className="mb-0">
                        {activeTab === 'users' && (
                            <>
                                <thead className="bg-secondary bg-opacity-10 text-muted">
                                    <tr>
                                        <th className="ps-4">User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Last Activity</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.map((user) => (
                                        <tr key={user.id} className="align-middle border-secondary border-opacity-25">
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-small me-3 bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white" style={{ width: '32px', height: '32px' }}>
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{user.name || 'Unknown User'}</div>
                                                        <small className="text-red">{user.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={user.role === 'admin' ? 'danger' : 'primary'} className="text-uppercase" style={{ fontSize: '10px' }}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td>
                                                {user.deleted_at ? (
                                                    <Badge bg="danger" className="rounded-pill">Suspended (Deleted)</Badge>
                                                ) : (
                                                    <Badge bg={user.is_active ? 'success' : 'secondary'} className="rounded-pill">
                                                        {user.is_active ? 'Active' : 'Deactivated'}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td>
                                                <small className="text-red">
                                                    {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                                                </small>
                                            </td>
                                            <td className="text-center pe-4">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        disabled={!!user.deleted_at}
                                                        title={user.deleted_at ? "Cannot deactivate deleted user" : (user.is_active ? 'Deactivate User' : 'Activate User')}
                                                    >
                                                        <FaPowerOff />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={user.role === 'admin' || !!user.deleted_at}
                                                        title={user.deleted_at ? "Already Suspended" : "Suspend User"}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-muted">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </>
                        )}

                        {activeTab === 'events' && (
                            <>
                                <thead className="bg-secondary bg-opacity-10 text-muted">
                                    <tr>
                                        <th className="ps-4">Event Date</th>
                                        <th>Title</th>
                                        <th>Category / Type</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th>Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events?.map((event) => (
                                        <tr key={event.id} className="align-middle border-secondary border-opacity-25">
                                            <td className="ps-4">
                                                <Badge bg="success" className="rounded-pill">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </Badge>
                                            </td>
                                            <td className="fw-bold text-white">{event.title}</td>
                                            <td>
                                                <Badge bg="info" className="text-uppercase" style={{ fontSize: '10px' }}>
                                                    {event.category || 'Event'}
                                                </Badge>
                                            </td>
                                            <td className="text-muted"><small>{event.location}</small></td>
                                            <td className="text-red fw-bold">BDT {event.price}</td>
                                            <td>{event.capacity} seats</td>
                                        </tr>
                                    ))}
                                    {events.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-muted">No events found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </>
                        )}

                        {activeTab === 'tickets' && (
                            <>
                                <thead className="bg-secondary bg-opacity-10 text-muted">
                                    <tr>
                                        <th className="ps-4">Booking ID</th>
                                        <th>Buyer Email</th>
                                        <th>Buyer Name</th>
                                        <th>Event Name</th>
                                        <th>Qty</th>
                                        <th>Status</th>
                                        <th>Purchase Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings?.map((booking) => (
                                        <tr key={booking.id} className="align-middle border-secondary border-opacity-25">
                                            <td className="ps-4 fw-bold">#{booking.id}</td>
                                            <td>
                                                <a href={`mailto:${booking.user?.email}`} className="text-red text-decoration-none fw-bold">
                                                    {booking.user?.email || 'Unknown Email'}
                                                </a>
                                            </td>
                                            <td className="text-white">{booking.user?.name || 'Unknown Name'}</td>
                                            <td className="text-white">{booking.event?.title || 'Unknown Event'}</td>
                                            <td><Badge bg="secondary">{booking.quantity}</Badge></td>
                                            <td>
                                                <Badge bg={booking.status === 'confirmed' ? 'success' : 'warning'}>
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="text-muted">
                                                <small>{new Date(booking.created_at).toLocaleDateString()}</small>
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-muted">No tickets booked yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </>
                        )}

                        {activeTab === 'subscriptions' && (
                            <>
                                <thead className="bg-secondary bg-opacity-10 text-muted">
                                    <tr>
                                        <th className="ps-4">Sub ID</th>
                                        <th>User Email</th>
                                        <th>Trx ID</th>
                                        <th>Method</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions?.map((sub) => (
                                        <tr key={sub.id} className="align-middle border-secondary border-opacity-25">
                                            <td className="ps-4 fw-bold text-white">#{sub.id}</td>
                                            <td>
                                                <a href={`mailto:${sub.email}`} className="text-red text-decoration-none fw-bold">
                                                    {sub.email}
                                                </a>
                                            </td>
                                            <td className="text-info fw-bold">{sub.transaction_id}</td>
                                            <td><Badge bg="secondary">{sub.payment_method}</Badge></td>
                                            <td className="text-muted"><small>{new Date(sub.created_at).toLocaleDateString()}</small></td>
                                            <td>
                                                <Badge bg={sub.status === 'active' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'}>
                                                    {sub.status}
                                                </Badge>
                                            </td>
                                            <td className="text-center pe-4">
                                                {sub.status === 'pending' && (
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button variant="outline-success" size="sm" onClick={() => handleAcceptSubscription(sub.id)}>
                                                            Accept
                                                        </Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleRejectSubscription(sub.id)}>
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                                {sub.status !== 'pending' && <span className="text-muted small">Processed</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    {subscriptions.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-muted">No subscription requests</td>
                                        </tr>
                                    )}
                                </tbody>
                            </>
                        )}
                    </Table>
                </Card.Body>
            </Card>

            {/* Add Event Modal */}
            <Modal show={showAddEventModal} onHide={() => setShowAddEventModal(false)} centered className="booking-modal">
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title className="fw-bold">Add New <span className="text-red">Event</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form onSubmit={handleAddEvent}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="bg-secondary bg-opacity-10 text-white border-secondary"
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="bg-secondary bg-opacity-10 text-white border-secondary"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Radisson Blu"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="bg-secondary bg-opacity-10 text-white border-secondary"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (BDT)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="300"
                                        value={newEvent.price}
                                        onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                                        className="bg-secondary bg-opacity-10 text-white border-secondary"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="100"
                                        value={newEvent.capacity}
                                        onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                                        className="bg-secondary bg-opacity-10 text-white border-secondary"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Image URL (Optional)</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://..."
                                value={newEvent.image}
                                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                                className="bg-secondary bg-opacity-10 text-white border-secondary"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe the event..."
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                className="bg-secondary bg-opacity-10 text-white border-secondary"
                                required
                            />
                        </Form.Group>
                        <Button variant="danger" type="submit" className="w-100 py-2 fw-bold" disabled={creating}>
                            {creating ? <Spinner size="sm" className="me-2" /> : null}
                            {creating ? 'Creating...' : 'CREATE EVENT'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
