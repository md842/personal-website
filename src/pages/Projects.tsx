import './Projects.css'

import {type ReactNode, useEffect, useState} from "react";
import {useTransition, animated} from '@react-spring/web'

import {ProjectCard} from '../components/ProjectCard.tsx';
import {type Project, getProjects, getTags} from '../components/core/project-data.ts';

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
  const [projectTags, setProjectTags] = useState([] as string[]);

  // Filter and search state variables
  const [filter, setFilter] = useState({} as Filter);
  const [searchTerm, setSearchTerm] = useState("");

  const filterButtonClassName: string = "mb-2";

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

  useEffect(() => { // Fixes rounded borders on flex wrapped tag filter buttons
    // useEffect runs on mount, ignore by checking database read completion
    if (projectTags.length > 0){ // Database read finished
      const onResize = () => { // Window resize event handler
        // Gets the ToggleButtonGroup that contains the tag filter buttons
        const btnGroup = document.getElementById("btn-group");
        /* Each ToggleButton consists of an invisible input element and a label
           element with className btn; we are only interested in the labels. */
        let btns: NodeListOf<HTMLElement> = btnGroup!.querySelectorAll<HTMLElement>(".btn");

        for (let i = 0; i < btns.length; i++) // Reset borders of all btns
          btns[i].className = filterButtonClassName + " btn btn-primary";

        for (let i = 0; i < btns.length - 1; i++){ // For each button
          // If y-pos of btns[i] != y-pos of btns[i + 1], flex wraps at btns[i]
          if (btns[i].getBoundingClientRect().y != btns[i + 1].getBoundingClientRect().y){
            btns[i].className += " rounded-end"; // End of current row
            btns[i + 1].className += " rounded-start"; // Start of next row
          }
        }
        // Restore rounded start to first button
        btns[0].className += " rounded-start";
      }
      window.addEventListener("resize", onResize);
      onResize(); // Run once to set initial size
      
      return() => { // useEffect cleanup; removes event listener
        window.removeEventListener("resize", onResize);
      }
    }
  }, [projectTags]); // Runs when database read finishes (projectTags changes)

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
        placeholder="Search for projects by title or category..."
      />

      <ToggleButtonGroup className="align-items-stretch flex-wrap mb-5" id="btn-group" type="checkbox">
        <div className="d-flex mb-2 align-items-center">
          <p className="me-2 mb-0">Or filter by tag(s):</p>
        </div>
        {projectTags.map((tag: string) => (
          <ToggleButton key={tag} // Generate buttons from database tags
            className={filterButtonClassName}
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

      <div> {/* Render project sections. */}
        <Section title="Featured Projects" data={projects[0]}/>
        <Section title="Projects" data={projects[1]}/>
      </div>
    </main>
  );
}