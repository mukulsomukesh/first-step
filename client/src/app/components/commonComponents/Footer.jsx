import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 mt-[25px] w-[100%] text-white py-6 z-50 " role="contentinfo">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Notes Master. All rights reserved.</p>
                <ul className="flex justify-center space-x-4 mt-4">
                    <li><Link href="/pages/privacy-policy" aria-label="Privacy Policy" className="hover:underline">Privacy Policy</Link></li>
                    <li><Link href="/pages/terms-of-service" aria-label="Terms of Service" className="hover:underline">Terms of Service</Link></li>
                    <li><Link href="/pages/contact" aria-label="Contact Us" className="hover:underline">Contact Us</Link></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;