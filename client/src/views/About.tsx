import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FiShield, FiClock, FiDollarSign, FiZap } from 'react-icons/fi';

const About: React.FC = () => {
    const features = [
        {
            icon: <FiShield size={40} className="text-danger" />,
            title: "Trusted Platform",
            description: "We provide a secure and reliable platform for all your ticket booking needs."
        },
        {
            icon: <FiClock size={40} className="text-danger" />,
            title: "24/7 Support",
            description: "Our dedicated support team is always available to help you with any queries."
        },
        {
            icon: <FiDollarSign size={40} className="text-danger" />,
            title: "Best Prices",
            description: "Get the most competitive prices for the hottest events in town."
        },
        {
            icon: <FiZap size={40} className="text-danger" />,
            title: "Easy Booking",
            description: "Book your favorite events in just a few clicks with our seamless interface."
        }
    ];

    return (
        <div className="about-page py-5 mt-5">
            <Container>
                <Row className="text-center mb-5">
                    <Col lg={8} className="mx-auto">
                        <h1 className="display-4 fw-bold text-white mb-3">Why Choose <span className="text-red">Us?</span></h1>
                        <p className="lead text-muted">AURA++ is your ultimate destination for discovering and booking the most exclusive events. We bring you closer to the experiences that matter.</p>
                    </Col>
                </Row>

                <Row className="g-4">
                    {features.map((feature, index) => (
                        <Col key={index} md={6} lg={3}>
                            <Card className="h-100 bg-dark border-secondary bg-opacity-50 text-white text-center p-4 card-hover">
                                <div className="mb-4 d-inline-block p-3 rounded-circle bg-danger bg-opacity-10">
                                    {feature.icon}
                                </div>
                                <h4 className="fw-bold mb-3">{feature.title}</h4>
                                <p className="text-muted small mb-0">{feature.description}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="mt-5 pt-5 align-items-center">
                    <Col lg={6}>
                        <h2 className="text-white fw-bold mb-4">Our <span className="text-red">Mission</span></h2>
                        <p className="text-muted mb-4">
                            Our mission is to bridge the gap between event organizers and attendees by providing a high-performance, secure, and user-friendly platform. We believe that every event is an opportunity for a unique experience, and we make it our priority to ensure that the journey from discovery to attending is flawless.
                        </p>
                    </Col>
                    <Col lg={6}>
                        <div className="p-4 bg-danger bg-opacity-10 rounded-4 border border-danger border-opacity-25">
                            <h3 className="text-white fw-bold mb-3 font-outfit">Experience the <span className="text-red">Aura</span></h3>
                            <p className="text-muted mb-0 italic">
                                "Technology is best when it brings people together. That's exactly what AURA++ aims to achieve with every ticket booked."
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
