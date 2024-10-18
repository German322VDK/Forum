import React from 'react';
import { Link } from 'react-router-dom'; // React Router для навигации
import '../assets/css/bootstrap.min.css'; // Стили для header
import '../assets/css/site.css'; 

function AccountLayout({ children }) {
    return (
        <div>
            <header>
                <div className="container d-flex justify-content-between align-items-center">
                    <h1>Forum Registration and Login</h1>
                    <span>
                        <Link to="/" className='account-header-a'>
                           <i className="fas fa-home"></i> Home
                        </Link>
                    </span>
                </div>
            </header>
            <main className="container">
                {children}
            </main>
        </div>
    );
}

export default AccountLayout;