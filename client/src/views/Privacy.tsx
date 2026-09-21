import { Container, Card } from 'react-bootstrap';

export default function Privacy() {
    return (
        <Container className="py-5">
            <Card className="p-4 bg-dark text-white border-secondary shadow-lg">
                <Card.Body>
                    <h1 className="text-center mb-4 fw-bold">Privacy Policy</h1>
                    <p className="text-muted text-center mb-5">Effective Date: February 15, 2026</p>

                    <section className="mb-4">
                        <h2 className="h4 text-info border-bottom border-info pb-2 mb-3">1. Information We Collect</h2>
                        <p>When you register and use AURA++, we collect the following types of information:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, phone number, and payment details.</li>
                            <li><strong>Usage Data:</strong> Information about the events you view, tickets you book, and how you interact with our platform.</li>
                            <li><strong>Device Information:</strong> IP address, browser type, and operating system.</li>
                        </ul>
                    </section>

                    <section className="mb-4">
                        <h2 className="h4 text-info border-bottom border-info pb-2 mb-3">2. How We Use Your Information</h2>
                        <p>Your data is used to provide and improve our services, including:</p>
                        <ul>
                            <li>Processing your ticket bookings and sending confirmations.</li>
                            <li>Providing customer support and responding to inquiries.</li>
                            <li>Personalizing your experience and recommending events you might like.</li>
                            <li>Ensuring security and preventing fraudulent transactions.</li>
                        </ul>
                    </section>

                    <section className="mb-4">
                        <h2 className="h4 text-info border-bottom border-info pb-2 mb-3">3. Data Sharing</h2>
                        <p>We do not sell your personal data. We only share information with:</p>
                        <ul>
                            <li><strong>Event Organizers:</strong> Only the necessary details required for event entry and management.</li>
                            <li><strong>Service Providers:</strong> Payment processors and cloud hosting services that help us run the platform.</li>
                            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights.</li>
                        </ul>
                    </section>

                    <section className="mb-4">
                        <h2 className="h4 text-info border-bottom border-info pb-2 mb-3">4. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information at any time. You can also opt-out of promotional communications through your account settings.</p>
                    </section>

                    <section className="mb-4">
                        <h2 className="h4 text-info border-bottom border-info pb-2 mb-3">5. Security</h2>
                        <p>We implement industry-standard security measures, including encryption and secure servers, to protect your data from unauthorized access.</p>
                    </section>

                    <div className="text-center mt-5">
                        <p className="small text-muted">If you have any questions about this Privacy Policy, please contact our support team.</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
