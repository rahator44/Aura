import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AddEventForm: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const api = new ApiClient();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '',
        capacity: '',
        category: 'Concert',
        city_country: '',
        image: ''
    });

    if (!isAdmin && !user?.is_subscribed) {
        return (
            <Container className="py-5 text-center mt-5">
                <div className="glass-card p-5 border-0 rounded-4 shadow-lg">
                    <h1 className="display-1 mb-4">🔒</h1>
                    <h2 className="text-white fw-bold mb-3">Access Denied</h2>
                    <p className="text-muted mb-4">Only active subscribers can add new events. Please check your subscription status.</p>
                    <Button variant="danger" className="btn-premium px-5 py-2 fw-bold" onClick={() => navigate('/subscription')}>
                        Subscribe Now
                    </Button>
                </div>
            </Container>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                image: formData.image || 'https://placehold.co/600x400/000000/000000'
            };
            const response = await api.createEvent(dataToSubmit);
            if (response.success) {
                toast.success('Event Added Successfully!');
                navigate('/events');
            } else {
                toast.error(response.message || 'Failed to add event');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
        <div className="add-event-page py-5 mt-5">
            <Container>
                <Row justify-content-center="true">
                    <Col lg={8} className="mx-auto">
                        <Card className="glass-card border-0 p-4">
                            <Card.Body>
                                <h2 className="fw-bold text-white mb-4 font-outfit text-center">Add New <span className="text-red">Event</span></h2>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-white opacity-75">Event Title</Form.Label>
                                        <Form.Control
                                            name="title"
                                            className="input-glass"
                                            placeholder="Enter event title"
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white opacity-75">Category</Form.Label>
                                                <Form.Select name="category" className="input-glass" onChange={handleChange}>
                                                    <option value="Concert">Concert</option>
                                                    <option value="Festival">Festival</option>
                                                    <option value="Exhibition">Exhibition</option>
                                                    <option value="Seminar">Seminar</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white opacity-75">Price (BDT)</Form.Label>
                                                <Form.Control
                                                    name="price"
                                                    type="number"
                                                    className="input-glass"
                                                    placeholder="300"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-white opacity-75">Description (Gallery View Details)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            rows={4}
                                            className="input-glass"
                                            placeholder="Enter details that will appear in gallery..."
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white opacity-75">Location</Form.Label>
                                                <Form.Control
                                                    name="location"
                                                    className="input-glass"
                                                    placeholder="Radisson Blu, Dhaka"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white opacity-75">Date & Time</Form.Label>
                                                <Form.Control
                                                    name="date"
                                                    type="datetime-local"
                                                    className="input-glass"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white opacity-75">City & Country</Form.Label>
                                                <Form.Control
                                                    name="city_country"
                                                    className="input-glass"
                                                    placeholder="Dhaka, Bangladesh"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="text-white opacity-75">Capacity</Form.Label>
                                                <Form.Control
                                                    name="capacity"
                                                    type="number"
                                                    className="input-glass"
                                                    placeholder="500"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-white opacity-75">Image URL</Form.Label>
                                                <Form.Control
                                                    name="image"
                                                    type="text"
                                                    className="input-glass"
                                                    placeholder="https://images..."
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button type="submit" variant="danger" className="btn-premium w-100 py-3">
                                        PUBLISH EVENT & DETAILS
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AddEventForm;
