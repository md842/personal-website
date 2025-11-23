import './ProjectCard.css';

import {type ReactNode, useEffect, useState} from 'react';

import NavButton from './NavButton.tsx';
import {type Project, unravelTags} from './core/project-data.ts';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

/** Constructs a Card element given a Project object specified by params. */
export function ProjectCard(params: Project): ReactNode{
  /* State variable for whether or not the current window size is adequate
     to use the overlay design (requires 768px width to look good). */
  const [useOverlay, setUseOverlay] = useState(window.innerWidth >= 768);

  useEffect(() => { // Adds an event listener for window resizing
    const onResize = () => { // Determine overlay design eligibility on resize
      setUseOverlay(window.innerWidth >= 768);
    }
    window.addEventListener("resize", onResize);
    onResize(); // Run once to set initial size
    
    return() => { // useEffect cleanup; removes event listener
      window.removeEventListener("resize", onResize);
    }
  }, []); // Runs on mount

  return(
    <Card className="h-100"> {/* Fill available row height */}
      {/* If image present and window size OK, use image overlay design. */}
      {params.image && useOverlay &&
        <div className="overlay-shadow"> {/* Ensures text readability */}
          <Card.Img src={params.image}/>
          <Card.ImgOverlay
            className="d-flex flex-column justify-content-between"
          >
            <div className="d-flex justify-content-end"> {/* Buttons on top */}
              {params.ext && // Render Button if params.ext is present
                <Button // Used for external links
                  className="btn-dark btn-outline-light translucent-btn"
                  onClick={() => window.open(params.ext)}
                >
                  Visit External Site &nbsp;
                  <i className="bi bi-box-arrow-up-right"/>
                </Button>
              }
              {params.sim && // Render NavButton if params.sim is present
                <NavButton // Used for internal links
                  className="btn-dark btn-outline-light translucent-btn"
                  href={params.sim}
                >
                  Run Simulation
                </NavButton>
              }
              {params.nb && // Render NavButton if params.nb is present
                <NavButton // Used for internal links
                  className="btn-dark btn-outline-light translucent-btn"
                  href={params.nb}
                >
                  View Notebook
                </NavButton>
              }
              {params.repo && // Render Button if params.repo is present
                <Button // Used for external links
                  className="btn-dark btn-outline-light translucent-btn ms-2"
                  onClick={() => window.open(params.repo)}
                >
                  View repository on GitHub
                  &nbsp;<i className="bi bi-box-arrow-up-right"/>
                </Button>
              }
            </div>
            <div> {/* Card title and description on bottom */}
              <Card.Title className="text-shadow-stack">
                {params.title}
              </Card.Title>
              <Card.Text className="text-shadow-stack">
                {params.card_desc}
              </Card.Text>
              <Card.Text className="text-shadow-stack">
                {unravelTags(params.tags)}
              </Card.Text>
            </div>
          </Card.ImgOverlay>
        </div>
      }

      {/* If no project image or window too small, use standard design. */}
      {(!params.image || !useOverlay) &&
        <>
          {params.image &&
            <Card.Img src={params.image}/>
          }
          <Card.Body className="d-flex flex-column justify-content-between">
            <div className="mb-3"> {/* Align title/desc to top of card body */}
              <Card.Title>{params.title}</Card.Title>
              <Card.Text>{params.card_desc}</Card.Text>
            </div>
            <div> {/* Align tags/buttons to bottom of card body */}
              {/* <p> standard margin-bottom is 1rem; split into mb-2 and mt-2
                * (0.5rem) here for easier vertical spacing on small screens
                * where the buttons must be rendered in different rows. */}
              <Card.Text className="mb-2">
                {unravelTags(params.tags)}
              </Card.Text>
              {params.ext && // Render Button if params.ext is present
                <Button className="me-2 mt-2"
                  onClick={() => window.open(params.ext)}
                >
                  Visit External Site &nbsp;
                  <i className="bi bi-box-arrow-up-right"/>
                </Button>
              }
              {params.sim && // Render NavButton if params.sim is present
                <NavButton className="me-2 mt-2" href={params.sim}>
                  Run Simulation
                </NavButton>
              }
              {params.nb && // Render NavButton if params.nb is present
                <NavButton className="me-2 mt-2" href={params.nb}>
                  View Notebook
                </NavButton>
              }
              {params.repo && // Render Button if params.repo is present
                <Button className="mt-2"
                  onClick={() => window.open(params.repo)}
                >
                  View repository on GitHub &nbsp;
                  <i className="bi bi-box-arrow-up-right"/>
                </Button>
              }
            </div>
          </Card.Body>
        </>
      }
    </Card>
  );
}