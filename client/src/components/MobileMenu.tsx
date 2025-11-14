import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi'; // Import icons for hamburger and close

interface MobileMenuProps {
  navLinks: { href: string; label: string }[];
  activeSection: string; // New prop for active section
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navLinks, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden"> {/* Only show on small screens */}
      <button onClick={toggleMenu} className="text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-300">
        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-8 animate-fade-in">
          <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-300">
            <HiX size={32} />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={toggleMenu} // Close menu on link click
              className={`text-gray-300 text-3xl font-bold hover:text-white transition-colors duration-300 ${activeSection === link.href ? 'text-blue-400' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;