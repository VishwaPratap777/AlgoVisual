import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;
    let ticking = false;

    const updateNavbar = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        setNavbarHidden(true);
      } else if (scrollTop < lastScrollTop || scrollTop <= 100) {
        setNavbarHidden(false);
      }
      
      setNavbarScrolled(scrollTop > 50);
      lastScrollTop = scrollTop;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  return (
    <nav className={`navbar ${navbarHidden ? 'navbar-hidden' : 'navbar-visible'} ${navbarScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-brand">Your Brand</a>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#" className="nav-link active">Home</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">About</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;