import {type ReactNode, useEffect, useState} from "react";

import {type Project, getProject, unravelTags} from '../../components/core/project-data.ts';
import NavButton from '../../components/NavButton.tsx';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export interface Simulation extends Project{
  // The name of the cerr textarea.                           Source: Database
  cerr_name?: string;
  // The size to render the cerr textarea with (in rows).     Source: Database
  cerr_size?: number;
  // The size to render the cout textarea with (in rows).     Source: Database
  cout_size?: number;
  // The defaut input for the simulation.
  default_input?: string;
  // Indicates whether the simulation input is raw or file.   Source: Database
  input_as_file?: boolean;
}

export default function SimInterface(): ReactNode{
  const [data, setData] = useState({
    long_desc: [""],
    tags: [""],
    title: "Loading from database..."
  } as Simulation); // Placeholder data to display while waiting for database

  useEffect(() => { // Performs database read on mount
    // Remove "/projects/sim/" (length 14) from pathname for target id
    let target_id = window.location.pathname.substring(14);
    getProject<Simulation>(target_id)
      .then(data => {
        setData(data);
        // Replace newlines in database output with actual newlines
        setInput(data.default_input!.replace(/\\n/g, '\n'));
      })
      .catch(error => console.log("Database error:", error));
  }, []); // Runs on mount

  // State variables for request I/O
  const [input, setInput] = useState("");
  const [cout, setCout] = useState("");
  const [cerr, setCerr] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault(); // Prevents refreshing page on form submission

    fetch('/', { // Send POST request to simulation backend
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: JSON.stringify({
        "input": input,
        "input_as_file": data.input_as_file,
        "source": window.location.pathname.substring(14),
      })
    })
    .then(response => response.json())
    .then((data) => { // Set output fields to response data
      setCout(data.cout);
      setCerr(data.cerr);
    })
    .catch((error) => {
      setCout(error); // Set output fields to caught error
    });
  }

  return(
    <main>
      <h1 className="mb-4">{data.title}</h1>
      <div className="mb-3">
        {data.long_desc!.map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
        <p className="mt-5">{unravelTags(data.tags)}</p>
        {(data.cout_size) && // Render only if cout_size is defined
          // (All sims define it, so if undefined, the database read failed)
          <p>
            This simulation runs on a custom interface that communicates with
            the back-end via a POST request, using JSON encoded data to specify
            an executable to run server-side and provide user-customizable
            input for the executable. The web server runs the executable as a
            background process, piping its output and encoding it as JSON
            within an HTTP response. Security mechanisms are in place to
            protect the server from excessive and/or unintended payloads.
          </p>
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
      {(data.cout_size) && // Render only if cout_size is defined
        // (All sims define it, so if undefined, the database read failed)
        <div className="border rounded-3">
          <p className="bg-dark border-bottom rounded-top px-3 py-2 text-white">
            C++ Back-end Interface
          </p>
          <Form className="px-3" onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className="mb-3" controlId="cpp-input">
              <Form.Label>Input</Form.Label>
              <Form.Control
                as="textarea"
                className="mb-3"
                rows={10}
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <Button type="submit">Submit</Button>
            </Form.Group>
            <Form.Label>Output</Form.Label>
            <Form.Control
              as="textarea"
              className="mb-3"
              rows={data.cout_size}
              value={cout}
              readOnly
            />
            {(data.cerr_size) && // Render only if cerr_size is set
              <>
                <Form.Label>{data.cerr_name}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={data.cerr_size}
                  value={cerr}
                  readOnly
                />
              </>
            }
          </Form>
        </div>
      }
    </main>
  );
}
