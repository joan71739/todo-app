import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Default from './Default';

function Home() {
    const [activeTab, setActiveTab] = useState('Default');

    const isLogin = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className="home-layout">
            <Navbar setActiveTab={setActiveTab} isLogin={isLogin} onLogout={handleLogout} />
            <main style={{ minHeight: '60vh', padding: '20px' }}>
                {activeTab === 'Default' && <Default />}
            </main>
            <Footer />
        </div>
    );
}

export default Home;