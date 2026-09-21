import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Button, Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ApiClient from "../api";

const api = new ApiClient();

interface BaseLayoutProps {
  children: ReactNode;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const MainLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBell, setShowBell] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    const res = await api.getNotifications();
    if (res.success) {
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBell(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleBellClick = async () => {
    setShowBell(!showBell);
    if (!showBell && unreadCount > 0) {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Navbar expand="lg" className="navbar-custom sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand">
            AURA<span className="text-red">++</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-secondary" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/">HOME</Nav.Link>
              <Nav.Link as={Link} to="/events">EVENT</Nav.Link>
              <Nav.Link as={Link} to="/about">ABOUT</Nav.Link>
              <Nav.Link as={Link} to="/subscription" className="text-warning fw-bold">SUBSCRIPTION</Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">DASHBOARD</Nav.Link>
              )}
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <div ref={bellRef} style={{ position: 'relative' }} className="ms-3">
                    <button
                      onClick={handleBellClick}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#fff', fontSize: '20px', position: 'relative', padding: '4px 8px'
                      }}
                      title="Notifications"
                    >
                      🔔
                      {unreadCount > 0 && (
                        <span style={{
                          position: 'absolute', top: '-4px', right: '-4px',
                          background: '#e53e3e', color: '#fff', borderRadius: '50%',
                          fontSize: '11px', width: '18px', height: '18px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Dropdown */}
                    {showBell && (
                      <div style={{
                        position: 'absolute', right: 0, top: '110%',
                        width: '320px', background: '#1a1a2e', border: '1px solid #333',
                        borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        zIndex: 9999, maxHeight: '400px', overflowY: 'auto'
                      }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #333', fontWeight: 'bold', color: '#fff' }}>
                          🔔 Notifications
                        </div>
                        {notifications.length === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} style={{
                              padding: '12px 16px', borderBottom: '1px solid #222',
                              background: n.is_read ? 'transparent' : 'rgba(229,62,62,0.08)',
                              transition: 'background 0.2s'
                            }}>
                              <div style={{
                                fontWeight: 'bold', fontSize: '13px',
                                color: n.type === 'success' ? '#48bb78' : n.type === 'danger' ? '#fc8181' : '#fff'
                              }}>
                                {n.title}
                              </div>
                              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                                {n.message}
                              </div>
                              <div style={{ fontSize: '11px', color: '#555', marginTop: '6px' }}>
                                {new Date(n.created_at).toLocaleString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-danger ms-3 me-2 fw-bold">Hi, {user?.name}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">LOGIN</Nav.Link>
                  <Button
                    variant="danger"
                    className="btn-primary-custom ms-3"
                    onClick={() => navigate("/register")}
                  >
                    REGISTER
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="p-0">
        {children}
      </main>

      <footer className="footer-premium pt-5 pb-4 mt-auto border-top border-dark">
        <Container>
          <Row>
            <Col lg={4} className="mb-4 mb-lg-0">
              <h4 className="fw-bold mb-4 font-outfit">AURA<span className="text-red">++</span></h4>
              <p className="text-muted small pe-lg-5">
                The ultimate platform for discovering and booking exclusive events. Join us to experience the best concerts, festivals, and more.
              </p>
            </Col>
            <Col lg={2} md={4} className="mb-4 mb-lg-0">
              <h6 className="text-white fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/subscription">Subscription</Link></li>
              </ul>
            </Col>
            <Col lg={2} md={4} className="mb-4 mb-lg-0">
              <h6 className="text-white fw-bold mb-3">Accounts</h6>
              <ul className="list-unstyled footer-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/terms">Terms</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
              </ul>
            </Col>
            <Col lg={4} md={4}>
              <h6 className="text-white fw-bold mb-3">Contact Us</h6>
              <ul className="list-unstyled footer-links">
                <li className="text-muted small mb-2">
                  <span className="text-red me-2">📍</span> Radisson Blu, Dhaka, Bangladesh
                </li>
                <li className="text-muted small mb-2">
                  <span className="text-red me-2">✉️</span> eventica@gmail.com
                </li>
                <li className="text-muted small mb-2">
                  <span className="text-red me-2">📞</span> +880 1234 567 890
                </li>
              </ul>
            </Col>
          </Row>
          <hr className="border-secondary opacity-10 my-4" />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted small">&copy; {new Date().getFullYear()} AURA++. All rights reserved.</p>
            <div className="social-links d-flex gap-3">
              <span className="text-muted small cursor-pointer hover-text-red">FB</span>
              <span className="text-muted small cursor-pointer hover-text-red">IG</span>
              <span className="text-muted small cursor-pointer hover-text-red">TW</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
