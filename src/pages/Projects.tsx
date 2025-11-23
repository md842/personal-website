import './Projects.css'

import {type ReactNode, useEffect, useState} from "react";
import {useTransition, animated} from '@react-spring/web'

import {ProjectCard} from '../components/ProjectCard.tsx';
import {type Project, getProjects, getTags} from '../components/core/project-data.ts';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

// Provides an index signature for the filter state.
interface Filter{
  [key: string]: boolean;
}

export default function Projects(): ReactNode{
  // State variables to be populated by database
  const [projects, setProjects] = useState([[], []] as Project[][]);
  const [projectTags, setProjectTags] = useState(["Loading from database..."] as string[]);

  // Filter and search state variables
  const [filter, setFilter] = useState({} as Filter);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { // Performs database read on mount
    getProjects()
      .then(data => setProjects(data)) // All projects
      .catch(error => console.log("Database error:", error));
    
    getTags()
      .then(data => setProjectTags(data))
      .catch(error => {
        setProjectTags(["Database error! Could not load tags."]);
        console.log("Database error:", error);
      });
  }, []); // Runs on mount

  /** Renders a project section, or appropriate message if none rendered. */
  function Section(props: {title: string, data: Project[]}): ReactNode{
    let displayed: Project[] = [];

    if (props.data){ // Undefined if database read incomplete
      props.data.forEach((project: Project) => { // Determine visibility
        if (resolveFilter(project.tags) && search(project.tags, project.title))
          displayed.push(project);
      })
    }

    return(
      <>
        <h3 className="mb-3">{props.title}</h3>
        <div // Keeps all cards in a row at the same height
          className="d-flex flex-wrap align-items-stretch mb-3"
          style={{gap: "0.5%"}} // Horizontal space between flex items
        >
          {props.data.length == 0 && // Data not yet loaded from database
            <p>Loading projects from database...</p>
          }

          <ProjectCards displayed={displayed}/>

          {props.data.length > 0 && displayed.length == 0 &&
            // Data is loaded from database but no cards are displayed
            <p>No projects were found that matched the filter settings.</p>
          }
        </div>
      </>
    );
  }

  /** Renders animated ProjectCards using React Spring transitions. */
  function ProjectCards(props: {displayed: Project[]}): ReactNode{
    const transitions = useTransition(props.displayed, {
      from: {opacity: 0},
      enter: {opacity: 1},
      leave: {opacity: 1},
    })

    return transitions((style, item) => (
      <animated.div className="project-card mb-3" style={style}>
        <ProjectCard key={item.title} project={item}/>
      </animated.div>
    ))
  }

  /** Helper function to determine whether a ProjectCard should be displayed
   *  based on filter. Due to boolean short-circuiting, returning true is
   *  equivalent to calling search(), while returning false skips search(). So,
   *  only return false if at least one filter is enabled (true).
   */
  function resolveFilter(tags: Array<string>): boolean{
    if (Object.keys(filter).length == 0) // Trivial case: Filter empty
      return true;

    let filtersDisabled = true;
    for (const key in filter){ // Check if any filters are enabled
      // Non-trivial case: Filter enabled, display card only if a tag matches
      if (filter[key] == true){
        filtersDisabled = false; // Flag that at least one filter is enabled
        // Search for the key inside the tags (partial match allowed)
        if (tags.some((element:string) => element.indexOf(key) != -1))
          return true; // True if search bar is empty
      }
    }
    /* Filter is enabled with no matches found (filterDisabled = false)
       or all filters are disabled (filterDisabled = true, go to search()). */
    return filtersDisabled;
  }

  /** Helper function to determine whether a ProjectCard should be displayed
   *  based on searchTerm. Only called if resolveFilter() returned true.
   */
  function search(tags: Array<string>, title: string): boolean{
    /* Helper function to determine whether a ProjectCard should be shown. 
       Only called if resolveFilter() returned true. */
    if (searchTerm.length == 0) // Trivial case: Empty
      return true; // Use output of resolveFilter() only

    // Search the title (case insensitive, partial match allowed)
    if (title.toLowerCase().includes(searchTerm))
      return true;

    // Search the tags (case insensitive, partial match allowed)
    if (tags.some((element:string) =>
        element.toLowerCase().indexOf(searchTerm) != -1))
      return true;

    return false; // No matches
  }

  return(
    <main>
      <Form.Control
        className="search-bar mb-3"
        // Set to lowercase for case insensitive search.
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        placeholder="Search for projects by title, category, or tags..."
      />

      <Container fluid className="mb-5" id="filter-container">
        <p id="filter-label">Or filter by tag(s):</p>
        <ToggleButtonGroup type="checkbox">
          {projectTags.map((tag: string) => (
            <ToggleButton key={tag} // Generate buttons from database tags.
              id={"filter-" + tag}
              type="checkbox"
              defaultChecked={filter[tag]}
              value={tag}
              onChange={(e) => 
                setFilter({
                  ...filter,
                  // Use button name as a key, set boolean to checked state
                  [e.currentTarget.value]: e.currentTarget.checked
                })
              }
            >
              {tag}
            </ToggleButton>)
            )
          }
        </ToggleButtonGroup>
      </Container>

      <div> {/* Render project sections. */}
        <Section title="Featured Projects" data={projects[0]}/>
        <Section title="Projects" data={projects[1]}/>
      </div>
    </main>
  );
}