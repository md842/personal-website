import './NotebookViewer.css'

import {type ReactNode, useEffect, useState} from "react";

import {type Project, getProject, unravelTags} from '../../components/core/project-data.ts';
import NavButton from '../../components/NavButton.tsx';

import Button from 'react-bootstrap/Button';

interface Notebook extends Project{
  // Location of notebook to embed.                           Source: Database
  nb_embed?: string;
}

export default function NotebookViewer(): ReactNode{
  const [data, setData] = useState({
    long_desc: [""],
    tags: [""],
    title: "Loading from database..."
  } as Notebook); // Placeholder data to display while waiting for database

  useEffect(() => { // Performs database read on mount
    // Remove "/projects/notebooks/" (length 20) from pathname for target id
    let target_id = window.location.pathname.substring(20);
    getProject<Notebook>(target_id)
      .then(data => setData(data)) // Fetch project data
      .catch(error => console.log("Database error:", error));
  }, []); // Runs on mount

  useEffect(() => { // Adds an event listener for window resizing
    const onResize = () => { // Recalculate dynamic iframe height on resize
      document.documentElement.style.setProperty('--dyn-height',
        "calc(" + window.innerHeight + "px - 6rem)");
    }
    window.addEventListener("resize", onResize);
    onResize(); // Run once to set initial size
    
    return() => { // useEffect cleanup; removes event listener
      window.removeEventListener("resize", onResize);
    }
  }, []); // Runs on mount
  
  return(
    <main>
      <h1 className="mb-4">{data.title}</h1>
      <div className="mb-3">
        {data.long_desc!.map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
        {data.tags &&
          <p className="mt-5">{unravelTags(data.tags)}</p>
        }
        <NavButton className="me-2" href="/projects">
          Back to projects
        </NavButton>
        {(data.repo) && // Render only if repo is defined
          <Button onClick={() => window.open(data.repo)}>
            View repository on GitHub
          </Button>
        }
      </div>
      {(data.nb_embed) && // Render only if nb_embed is defined
        // Wrap iframe in div for desired scroll properties on small screens
        <div className="nb-viewport">
          <iframe src={data.nb_embed}/>
        </div>
      }
    </main>
  );
}