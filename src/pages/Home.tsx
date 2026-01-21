import './Home.css';

import {type ReactNode, useEffect, useState} from 'react';

import picture from '../assets/picture.jpg';
import {ProjectCard} from '../components/ProjectCard.tsx';
import {type Project, getProjects} from '../components/core/project-data.ts';

import Carousel from 'react-bootstrap/Carousel';
import Nav from 'react-bootstrap/Nav';
import {useScroll, animated} from '@react-spring/web'

export default function Home(): ReactNode{
  const [projects, setProjects] = useState([{
    card_desc: "",
    title: "Loading from database...",
    tags: ["Loading from database..."]
  }]); // Placeholder card to display while waiting for database

  useEffect(() => {
    getProjects() // Perform database read on mount
      .then(data => setProjects(data[0])) // Index 0: featured projects only
      .catch(error => console.log("Database error:", error));
  }, []); // Runs on mount

  const numPages: number = 4;

  /* Debug info
  let rem: number = parseInt(getComputedStyle(document.documentElement).fontSize);
  let headerSize: number = 4 * rem;
  let footerSize: number = 7.5 * rem;
  let pageHeight: number = window.innerHeight - headerSize;
  let pagesHeight: number = numPages * pageHeight;
  let scrollableHeight: number = pagesHeight + footerSize;
  let totalHeight: number = scrollableHeight + headerSize;

  console.log("pageHeight:", pageHeight,
              "pagesHeight:", pagesHeight,
              "scrollableHeight:", scrollableHeight,
              "totalHeight:", totalHeight);
  */

  const [activePage, setActivePage] = useState(0); // Custom scrollspy
  const {scrollYProgress} = useScroll({ // scrollYProgress used by animated.div
    onChange: ({value: {scrollYProgress}}) => { // Custom scrollspy
      /* Debug info
      console.log("scrollYProgress:", scrollYProgress, scrollYProgress * scrollableHeight + "px");
      */
      setActivePage(~~(scrollYProgress * numPages)); // Fast truncate using NOT
    },
  });

	return(
    <main className="home column-if-mobile m-0"> {/* Override default margin on main element */}
      <section className="text-center bg-dark-subtle"> {/* Profile */}
        <h1>Max Deng</h1>
        <img className="mw-100 rounded-circle my-3" src={picture}/>
        <h5>Computer Science B.S.</h5>
        <h5>University of California Los Angeles (UCLA)</h5>
        <a href="https://github.com/md842" target="_blank">
          <i className="bi bi-github me-3"></i>
        </a>
        <a href="https://www.linkedin.com/in/maxdeng/" target="_blank">
          <i className="bi bi-linkedin"></i>
        </a>
        <Nav defaultActiveKey="#about-me" className="quick-nav flex-column">
          <Nav.Link href="#about-me" active={activePage == 0}>
            About Me
          </Nav.Link>
          <Nav.Link href="#featured-projects" active={activePage == 1}>
            Featured Projects
          </Nav.Link>
          <Nav.Link href="#maxs-custom-computers" active={activePage == 2}>
            Max's Custom Computers
          </Nav.Link>
          <Nav.Link href="#about-this-website" active={activePage >= 3}>
            About This Website
          </Nav.Link>
        </Nav>
      </section>

      <aside> {/* Pages */}
        <animated.div className="page" id="about-me"
          style={{opacity: scrollYProgress.to(val =>
            1 - (5 * (val - 0.05)))}} // Fade out: 0.05 ~ 0.25
        >
          <h3 className="dyn-0">About Me</h3>
          <p className="dyn-3">
            I am a passionate and driven computer science graduate who strives
            to make my mark on the world through software engineering.
          </p>
          <p className="dyn-2 mb-0">
            I graduated from UCLA with a B.S. in Computer Science in December
            2024 and am currently seeking employment opportunities.
          </p>
          <animated.div className="scroll-icon"
            style={{opacity: scrollYProgress.to(val =>
              1 - (20 * val))}} // Fade out: 0 ~ 0.05
          >
            <i className="bi bi-chevron-down fs-1"/>
          </animated.div>
        </animated.div>
        
        <animated.div className="page" id="featured-projects"
          style={{opacity: scrollYProgress.to(val =>
            (val < 0.25) ? 5 * (val - 0.05) : // Fade in: 0.05 ~ 0.25
            ((val > 0.375) ? 1 - (5 * (val - 0.375)) : // Fade out: 0.375 ~ 0.575
              1))}} // Peak opacity: 0.25 ~ 0.375
        >
          <h3 className="dyn-3">Featured Projects</h3>
          <p className="dyn-1-5 mb-2">
            Below is a selection of my favorite projects. My full portfolio is
            available on the <a href="/projects">projects page</a>.
          </p>
          <Carousel className="project-carousel w-100">
            {projects.map((project: Project) => { // Create a carousel item for each
              return(
                <Carousel.Item key={project.title}>
                  <ProjectCard homepage project={project}/>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </animated.div>

        <animated.div className="page" id="maxs-custom-computers"
          style={{opacity: scrollYProgress.to(val =>
            (val < 0.575) ? 5 * (val - 0.375) : // Fade in: 0.375 ~ 0.575
            ((val > 0.7) ? 1 - (5 * (val - 0.7)) : // Fade out: 0.7 ~ 0.9
              1))}} // Peak opacity: 0.575 ~ 0.7
        >
          <div className="d-flex column-if-mobile">
            <div className="pc-desc">
              <h3 className="dyn-3">Max's Custom Computers</h3>
              <p className="dyn-1-5 mb-2">
                is a sole proprietorship I have been operating since 2020, with
                hundreds of satisfied customers served all over the Bay Area.
              </p>
            </div>
            <Carousel className="pc-carousel">
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/JIV4JEc.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/KrwooKs.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/vpF0D58.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/i41uIO0.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/TL5zQ84.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/ecKlC3q.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/3Uscp6W.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/HGJDZNg.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/g0wfLK0.jpeg"/>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-fluid" src="https://i.imgur.com/QeKsuk7.jpeg"/>
              </Carousel.Item>
            </Carousel>
          </div>
        </animated.div>
        
        <animated.div className="page" id="about-this-website"
          style={{opacity: scrollYProgress.to(val =>
            5 * (val - 0.75))}} // Fade in: 0.75 ~ 0.95
        >
          <h3 className="dyn-3">About This Website</h3>
          <p className="dyn-1-5">
            I've put a unique twist on the classic personal portfolio website
            and showcased my full stack development skills by writing both the
            website and the web server from scratch.&nbsp;
            <a href="https://github.com/md842/webserver/" target="_blank">
              See the GitHub repository here (opens a new tab).
            </a>
          </p>
          <p className="dyn-1-5">
            The front end is built with&nbsp;
            <a href="https://react.dev/" target="_blank">React</a> +
            TypeScript. The back end consists of a web server and a database;
            the web server is written in C++ with&nbsp;
            <a href="https://www.boost.org/" target="_blank">Boost</a>, and the
            database used is&nbsp;
            <a href="https://firebase.google.com/" target="_blank">
              Google Cloud Firestore
            </a>.
          </p>
          <p className="dyn-1-5">
            I have implemented many advanced features into this website,
            including the ability to&nbsp;
            <a href="/projects/sim/cpu-simulator">
              run some of my past projects' binaries through a web interface
            </a>
            &nbsp;that communicates with the server's custom POST request
            handler. In addition, project pages are generated dynamically from
            a database rather than hardcoded, which allows me to easily add new
            projects to my portfolio without having to change any source files.
          </p>
        </animated.div>
      </aside>
    </main>
	);
}