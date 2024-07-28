'use client'
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';

const GetPremium = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4 text-cultured">The ultimate practice tool for musicians.</h1>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="!bg-chinese-black border-2 !border-muted-blue">
            <Card.Body>
              <Card.Title className="text-center !text-cyan !text-3xl">Upgrade to Premium</Card.Title>
              <Card.Text className="text-center !text-cultured">
                <span className="text-2xl text-bold">$1.99</span> / Month
              </Card.Text>
              <ListGroup variant="flush" className="!bg-chinese-black">
                <ListGroup.Item className="!bg-inherit !text-cultured !border-arsenic !flex !flex-row !items-center"><FaCheck className="mr-2" />Save your projects to your song library</ListGroup.Item>
                <ListGroup.Item className="!bg-inherit !text-cultured !border-arsenic !flex !flex-row !items-center"><FaCheck className="mr-2" />Share your songs with your friends (free users gain read-only access)</ListGroup.Item>
                <ListGroup.Item className="!bg-inherit !text-cultured !border-arsenic !flex !flex-row !items-center"><FaCheck className="mr-2" />Save others' songs and edit them however you want</ListGroup.Item>
                <ListGroup.Item className="!bg-inherit !text-cultured !border-arsenic !flex !flex-row !items-center"><FaCheck className="mr-2" />Support me, a poor person</ListGroup.Item>
              </ListGroup>
              <div className="d-flex justify-content-center mt-4">
                <Button href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} variant="primary" size="lg" className="!bg-persian-pink !text-chinese-black !font-medium !border-none">Get Premium</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GetPremium;
