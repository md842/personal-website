import {type ReactNode} from 'react';

import {collection, getDocs} from "firebase/firestore";
import db from './firebaseConfig.ts';
import NavButton from './NavButton.tsx';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

/** Props interface for ProjectCard(). */
export interface Project{
  // Title of project.                                        Source: Database
  title: string;
  // Short form description of project for card display.      Source: Database
  card_desc: string;
  // If present, card will display an image.                  Source: Database
  image?: string;
  // If present, "Open" button will appear.                   Source: Database
  ext?: string;
  // If present, "View Notebook" button will appear.          Source: Database
  nb?: string;
  // If present, "View repository" button will appear.        Source: Database
  repo?: string;
  // If present, "Run Simulation" button will appear.         Source: Database
  sim?: string;
  // Tags associated with the project.                        Source: Database
  tags: Array<string>;
}

/** Constructs a Card element given a Project object specified by params. */
export function ProjectCard(params: Project): ReactNode{
  let unraveledTags = ""; // Convert tags array to string
  params.tags.forEach(element => unraveledTags += element + ", ");
  unraveledTags = unraveledTags.substring(0, unraveledTags.length - 2);

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
          <Card.Text className="mb-2">Tags: {unraveledTags}</Card.Text>
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

/** 
 * Reads project data from the database with two modes, all or featured only.
 * @param all If true, reads both featured and non-featured projects.
 *     If false, reads featured projects only.
 * @return If all = true, returns two arrays of Project objects where element 0
 *     contains featured projects and element 1 contains non-featured projects.
 *     If all = false, returns one array containing only featured projects.
 */
export async function readProjectData(all: boolean): Promise<Array<Array<Project>>>{
  let out = [new Array<Project>]; // Initialize Array<Array<Project>> output
  if (all) // Only allocate the extra memory if it will be used
    out.push(new Array<Project>);

  const dbQuery = await getDocs(collection(db, "projects"));
  dbQuery.forEach((doc) => { // For each document in the "projects" collection:
    if (all || doc.data().featured){ // Only create object if it will be used
      let projectObj: Project = {
        title: doc.data().title,
        card_desc: doc.data().card_desc,
        image: doc.data().image,
        ext: doc.data().ext,
        nb: doc.data().nb,
        repo: doc.data().repo,
        sim: doc.data().sim,
        tags: doc.data().tags
      };
      if (doc.data().featured) // Featured, push to element 0 of output
        out[0].push(projectObj);
      else // Non-featured, all = true, push to element 1 of output
        out[1].push(projectObj);
    }
  });
  return out; // async function implicitly wraps output in a Promise
}