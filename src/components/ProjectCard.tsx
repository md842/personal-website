import {type ReactNode} from 'react';

import NavButton from './NavButton.tsx';
import {type Project, unravelTags} from './core/project-data.ts';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

/** Constructs a Card element given a Project object specified by params. */
export function ProjectCard(params: Project): ReactNode{
  return(
    <Card className="h-100"> {/* Expand card to fill available height */}
      {params.image && // Return img element if params.image is present
        <Card.Img src={params.image}/>
      }
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="mb-3"> {/* Align title/desc to top of card body */}
          <Card.Title>{params.title}</Card.Title>
          <Card.Text>{params.card_desc}</Card.Text>
        </div>
        <div> {/* Align tags/buttons to bottom of card body */}
          {/* Standard margin-bottom for <p> is mb-3 (1rem); split into mb-2 and
            * mt-2 (0.5rem) here for easier vertical spacing on small screens
            * where the buttons must be rendered in different rows. */}
          <Card.Text className="mb-2">{unravelTags(params.tags)}</Card.Text>
          {params.ext && // Return Button element if params.ext is present
            <Button className="mt-2" onClick={() => window.open(params.ext)}>
              Visit External Site &nbsp;<i className="bi bi-box-arrow-up-right"/>
            </Button>
          }
          {params.sim && // Return NavButton element if params.sim is present
            <NavButton className="me-2 mt-2" href={params.sim}>
              Run Simulation
            </NavButton>
          }
          {params.nb && // Return NavButton element if params.nb is present
            <NavButton className="me-2 mt-2" href={params.nb}>
              View Notebook
            </NavButton>
          }
          {params.repo && // Return Button element if params.repo is present
            <Button className="mt-2" onClick={() => window.open(params.repo)}>
              View repository on GitHub
              &nbsp;<i className="bi bi-box-arrow-up-right"/>
            </Button>
          }
        </div>
      </Card.Body>
    </Card>
  );
}