import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import GradientScroll from './GradientScroll';

export default function Header(){
  const [darkMode, setDarkMode] = useState(initDarkMode);
  const [brand, setBrand] = useState("Max Deng");

  function initDarkMode(): boolean{ // Dark mode state initializer function
    // Attempt to load saved dark mode setting from local storage
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode){ // Data for dark mode setting exists in local storage
      try{ // JSON.parse() throws exception if storedDarkMode not valid boolean
        return JSON.parse(storedDarkMode); // Use local stored data
      }
      catch(e){ // Error parsing storedDarkMode from string to boolean
        // May occur if local stored data was corrupted or tampered with
        return true; // Default to true (dark mode)
      }
    }
    return true; // If undefined (first visit), default to true (dark mode)
  }

  useEffect(() => {
    // Apply appropriate Bootstrap theme for the value of darkMode
    document.documentElement.setAttribute('data-bs-theme', darkMode ? "dark" : "light");

    // Allows dark mode setting to persist between sessions
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]); // Runs on mount and when darkMode changes

  useEffect(() => { // Determine which brand to use on window resize
    const onResize = () => { // Window resize event handler
      setBrand(window.innerWidth >= 600 ? "Max Deng" : "MD");
    }
    window.addEventListener("resize", onResize);
    onResize(); // Run once to set initial size
    
    return() => { // useEffect cleanup; removes event listener
      window.removeEventListener("resize", onResize);
    }
  }, []); // Runs on mount

  return(
    <header className="sticky-top">
      <Navbar bg="secondary-subtle" data-bs-theme="dark">
        <Container>
          {/* Group Navbar Brand and Links away from dark mode button */}
          <div className="d-flex flex-shrink-1" // Shrink when Navbar too small
            style={{minWidth: 0}} // Avoid clamping to minimum size
          >
            <Navbar.Brand className="ms-3" as={Link} to="/">
              {brand} {/* "Max Deng" or "MD" depending on screen size */}
            </Navbar.Brand>

            <GradientScroll className="mx-3 flex-shrink-1"
              style={{minWidth: 0}} // Avoid clamping to minimum size
              gradWidth="0.5rem"
              endColor="var(--bs-secondary-bg-subtle)"
            >
              <Nav className="overflow-scroll" variant="underline"
                // activeKey highlights active page in Navbar
                activeKey={'/' + useLocation().pathname.split('/')[1]}
                style={{scrollbarWidth: "none"}} // Hide scrollbar in Navbar
              >
                <Nav.Link as={Link} eventKey="/" to="/">Home</Nav.Link>
                <Nav.Link as={Link} eventKey="/projects" to="/projects">Projects</Nav.Link>
                <Nav.Link as={Link} eventKey="/leetcode" to="/leetcode">LeetCode</Nav.Link>
              </Nav>
            </GradientScroll>
          </div>

          <Button variant="link"
            onClick={() => setDarkMode(prev => !prev)}
            style={{height: "3rem"}}
          >
            <i className={"fs-2 lh-1 " + // Bootstrap styling
              /* Bootstrap icon determined by dark mode setting;
                if dark mode, sun icon as "switch to light mode" button,
                if light mode, moon icon as "switch to dark mode" button. */
              "bi bi-" + (darkMode ? "sun" : "moon") + "-fill"}
            />
          </Button>
        </Container>
      </Navbar>
    </header>
  );
}