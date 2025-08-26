import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavScrollExample({ setActiveTab, isLogin, onLogout }) {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand href="#">任務管理系統</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#" onClick={() => setActiveTab('Default')}>首頁</Nav.Link>
                    </Nav>
                    {isLogin && (
                        <Button variant="outline-danger" onClick={onLogout} style={{ width: '5rem' }}>
                            登出
                        </Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavScrollExample;