import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import ApiClient from '../api';
import toast from 'react-hot-toast';

interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
}

const Gallery: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const api = new ApiClient();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.getEvents();
                if (response.success) {
                    setEvents(response.events);
                }
            } catch (error) {
                toast.error('Failed to load gallery images');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5 mt-5">
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <div className="gallery-page py-5 mt-5">
            <Container>
                <div className="text-center mb-5">
                    <h6 className="text-red fw-bold text-uppercase">Moments</h6>
                    <h1 className="display-4 fw-bold text-white font-outfit">Event <span className="text-red">Gallery</span></h1>
                    <p className="text-muted lead font-inter">Relive the most memorable moments from our exclusive festivals and concerts.</p>
                </div>

                <Row className="g-5">
                    {events.map((event) => (
                        <Col key={event.id} lg={6} md={12} className="mb-5">
                            <div className="gallery-item cursor-pointer">
                                <div className="gallery-img-wrapper rounded-4 overflow-hidden mb-4" style={{ height: '500px', position: 'relative' }}>
                                    <img
                                        src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200'}
                                        alt={event.title}
                                        className="img-fluid gallery-img h-100 w-100 object-fit-cover transition-transform duration-500 hover-scale-img"
                                    />
                                </div>
                                <div className="gallery-caption text-center">
                                    <h2 className="gallery-title font-outfit mb-2">{event.title}</h2>
                                    <div className="view-details-link text-red fw-bold text-uppercase">View Details</div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Gallery;
