import './ProjectCard.css';

import {type ReactNode, useEffect, useState} from 'react';

import NavButton from './NavButton.tsx';
import {type Project, unravelTags} from './core/project-data.ts';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface ProjectCardProps{
  homepage?: boolean
  project: Project;
}

/** Constructs a Card element given a Project object. */
export function ProjectCard(props: ProjectCardProps): ReactNode{
  let {homepage, project} = props; // Unpack props

  /* Use overlay design if project has an image AND window width >= 768px,
     else use card design. Just init false, will be determined on mount. */
  const [useOverlay, setUseOverlay] = useState(false);

  useEffect(() => { // Adds an event listener for window resizing
    const onResize = () => { // Re-determine overlay eligibility on resize
      setUseOverlay(project.image != undefined && window.innerWidth >= 768);
    }
    window.addEventListener("resize", onResize);
    onResize(); // Run once to set initial size
    
    return() => { // useEffect cleanup; removes event listener
      window.removeEventListener("resize", onResize);
    }
  }, []); // Runs on mount

  /** Helper function that renders card buttons, reduces code duplication. */
  function ProjectCardButtons(): ReactNode{
    // Overlay design and card design have different default classNames.
    let className = useOverlay ?
      "btn-dark btn-outline-light translucent-btn" :
      "card-btn mt-2";

    return(
      <div id={project.title + " btn-wrapper"}>
        {project.ext && // Render Button if params.ext is present
          <Button // Used for external links
            // If card mode, button may exist to the right, add end margin
            className={(useOverlay ? "" : "me-2 ") + className}
            onClick={() => window.open(project.ext)}
          >
            Visit External Site &nbsp;
            <i className="bi bi-box-arrow-up-right"/>
          </Button>
        }
        {project.sim && // Render NavButton if params.sim is present
          <NavButton // Used for internal links
            // If card mode, button may exist to the right, add end margin
            className={(useOverlay ? "" : "me-2 ") + className}
            href={project.sim}
          >
            Run Simulation
          </NavButton>
        }
        {project.nb && // Render NavButton if params.nb is present
          <NavButton // Used for internal links
            // If card mode, button may exist to the right, add end margin
            className={(useOverlay ? "" : "me-2 ") + className}
            href={project.nb}
          >
            View Notebook
          </NavButton>
        }
        {project.repo && // Render Button if params.repo is present
          <Button // Used for external links
            // If overlay mode, button may exist to the left, add start margin
            className={className + (useOverlay ? " ms-2" : "")}
            onClick={() => window.open(project.repo)}
          >
            View repository on GitHub
            &nbsp;<i className="bi bi-box-arrow-up-right"/>
          </Button>
        }
      </div>
    );
  }

  return(
    <Card className="h-100"> {/* Fill available row height */}
      {useOverlay && // Image present and window size OK, render overlay design
        <div
          /* Ensures text readability. Responsive scaling works differently
             if the card is a column of a row, set className accordingly. */
          className={"overlay-shadow" + (homepage ? "-home" : "")}
        > 
          <Card.Img src={project.image}/>
          <Card.ImgOverlay
            className="d-flex flex-column justify-content-between"
          >
            <div className="d-flex justify-content-end"> {/* Buttons on top */}
              <ProjectCardButtons/>
            </div>
            <div> {/* Card title and description on bottom */}
              <Card.Title className="text-shadow-stack">
                {project.title}
              </Card.Title>
              <Card.Text className="text-shadow-stack">
                {project.card_desc}
              </Card.Text>
              <Card.Text className="text-shadow-stack">
                {unravelTags(project.tags)}
              </Card.Text>
            </div>
          </Card.ImgOverlay>
        </div>
      }

      {!useOverlay && // No image or window too small, render card design
        <>
          {project.image && // Image is present, window size too small
            <Card.Img src={project.image}/>
          }
          <Card.Body className="d-flex flex-column justify-content-between">
            <div className="mb-3"> {/* Align title/desc to top of card body */}
              <Card.Title>{project.title}</Card.Title>
              <Card.Text>{project.card_desc}</Card.Text>
            </div>
            <div> {/* Align tags/buttons to bottom of card body */}
              {/* <p> standard margin-bottom is 1rem; split into mb-2 and mt-2
                * (0.5rem) here for easier vertical spacing on small screens
                * where the buttons must be rendered in different rows. */}
              <Card.Text className="mb-2">
                {unravelTags(project.tags)}
              </Card.Text>
              <ProjectCardButtons/>
            </div>
          </Card.Body>
        </>
      }
    </Card>
  );
}