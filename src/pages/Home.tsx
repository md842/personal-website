import './Home.css';

import {type ReactNode, useEffect, useState} from 'react';

import picture from '../assets/picture.jpg';
import {ProjectCard} from '../components/ProjectCard.tsx';
import {type Project, getProjects} from '../components/core/project-data.ts';

import Carousel from 'react-bootstrap/Carousel';
import {Link, scrollSpy} from 'react-scroll';

export default function Home(): ReactNode{
  const [projects, setProjects] = useState([{
    card_desc: "",
    title: "Loading from database...",
    tags: ["Loading from database..."]
  }]); // Placeholder card to display while waiting for database

  useEffect(() => { // Performs database read on mount
    getProjects()
      .then(data => setProjects(data[0])) // Index 0: featured projects only
      .catch(error => console.log("Database error:", error));
  }, []); // Runs on mount

  scrollSpy.update(); // Initialize scrollSpy on mount; sets active link

  // Used to compute header size for scrolling offsets
  let rem: number = parseInt(getComputedStyle(document.documentElement).fontSize);

	return(
    <main className="home m-0"> {/* Override default margin on main element */}
      <section className="text-center bg-dark-subtle">
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
        <div className="quick-nav d-flex flex-column">
          <Link to="about-me" spy={true} // Highlight on scroll
            smooth={true} duration={50} // Animate scroll
            offset={-4 * rem} // Offset 4rem header size
          >
            About Me
          </Link>
          <Link to="featured-projects" spy={true} // Highlight on scroll
            smooth={true} duration={50} // Animate scroll
            offset={-4 * rem} // Offset 4rem header size
          >
            Featured Projects
          </Link>
          <Link to="about-this-website" spy={true} // Highlight on scroll
            smooth={true} duration={50} // Animate scroll
            offset={-4 * rem} // Offset 4rem header size
          >
            About This Website
          </Link>
        </div>
      </section>

      <aside>
        <div className="page" id="about-me">
          <h3 className="dyn-0">About Me</h3>
          <p className="dyn-3">
            I am a passionate and driven computer science graduate who strives
            to make my mark on the world through software engineering.
          </p>
          <p className="dyn-2 mb-0">
            I graduated from UCLA with a B.S. in Computer Science in December
            2024 and am currently seeking employment opportunities.
          </p>
        </div>
        <div className="page" id="featured-projects">
          <h3 className="dyn-3">Featured Projects</h3>
          <p className="dyn-1-5 mb-2">
            Below is a selection of my favorite projects. I would be delighted
            if you took the time to view my full portfolio on the&nbsp;
            <a href="/projects">projects page</a>.
          </p>
          <Carousel className="w-100">
            {projects.map((project: Project) => { // Create a carousel item for each
              return(
                <Carousel.Item key={project.title}>
                  <ProjectCard homepage project={project}/>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
        <div className="page" id="about-this-website">
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
        </div>
      </aside>
    </main>
	);
}