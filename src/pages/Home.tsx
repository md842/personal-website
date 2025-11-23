import './Home.css';

import {type ReactNode, useEffect, useState} from 'react';

import picture from '../assets/picture.jpg';
import {ProjectCard} from '../components/ProjectCard.tsx';
import {type Project, getProjects} from '../components/core/project-data.ts';

import Carousel from 'react-bootstrap/Carousel';

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

	return(
    <main className="home">
      <section className="text-center mb-3">
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
      </section>

      <aside>
        <h3>About Me</h3>
        <p>
          I am a passionate and driven computer science graduate who strives to
          make my mark on the world through software engineering.
        </p>
        <p>
          I graduated from UCLA with a B.S. in Computer Science in December
          2024 and am currently seeking employment opportunities.
        </p>
        <br/>
        <h3>About This Website</h3>
        <p>
          I've put a unique twist on the classic personal portfolio website and
          showcased my full stack development skills by writing both the
          website and the web server from scratch.&nbsp;
          <a href="https://github.com/md842/webserver/" target="_blank">
            See the GitHub repository here (opens a new tab).
          </a>
        </p>
        <p>
          The front end is built with <a href="https://react.dev/" target="_blank">React</a> +
          TypeScript. The back end consists of a web server and a database; the
          web server is written in C++ with&nbsp;
          <a href="https://www.boost.org/" target="_blank">Boost</a>, and the database used
          is <a href="https://firebase.google.com/" target="_blank">Google Cloud Firestore</a>.
        </p>
        <p>
          I have implemented many advanced features into this website,
          including the ability to&nbsp;
          <a href="/projects/sim/cpu-simulator">
            run some of my past projects' binaries through a web interface
          </a>
          &nbsp;that communicates with the server's custom POST request
          handler. In addition, project pages are generated dynamically from a
          database rather than hardcoded, which allows me to easily add new
          projects to my portfolio without having to change any source files.
        </p>
        <br/>
        <h3>Featured Projects</h3>
        <Carousel>
          {projects.map((project: Project) => { // Create a carousel item for each
            return(
              <Carousel.Item key={project.title}>
                <ProjectCard homepage project={project}/>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </aside>
    </main>
	);
}