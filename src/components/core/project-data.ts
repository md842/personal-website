import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import db from '../firebaseConfig.ts';

export interface Project{
  id?: string; // Document id of project.
  title: string; // Title of project.
  featured?: number; // If defined, indicates index of featured project.
  image?: string; // If present, card will display an image.
  card_desc: string; // Short form description of project for card display.
  long_desc?: string[]; // Long form description of project for page display.
  tags: Array<string>; // Tags associated with the project.

  
  ext?: string; // If present, "Open" button will appear.
  nb?: string; // If present, "View Notebook" button will appear.
  repo?: string; // If present, "View repository" button will appear.
  sim?: string; // If present, "Run Simulation" button will appear.
}

/** Reads a project document from the database with a specific target_id.
 *  Type should be Project or a compatible type (Notebook, Simulation, etc.)
 */
export async function getProject<Type>(target_id: string): Promise<Type>{
  const dbQuery = await getDoc(doc(db, "projects", target_id));
  return {id: dbQuery.id, ...dbQuery.data() as Type};
}

/** Reads projects from the database and returns a 2D array of Project objects.
 *  Index 0 contains featured projects, index 1 contains other projects. */
export async function getProjects(): Promise<Project[][]>{
  let projectData: Project[][] = [[], []];

  // Get all documents in the "projects" collection
  const dbQuery = await getDocs(collection(db, "projects"));
  dbQuery.forEach((doc) => {
    // Construct a Project object for each document
    let projectObj: Project = {id: doc.id, ...doc.data() as Project};

    if (doc.data().featured != undefined) // Featured project, push to element 0
      projectData[0].push(projectObj);
    else // Not a featured project, push to element 1
      projectData[1].push(projectObj);
  });
  // Sort featured projects by featured index
  projectData[0].sort((a, b) => a.featured! - b.featured!);
  return projectData;
}

/** Reads project tags from the database and returns them as a string array. */
export async function getTags(): Promise<string[]>{
  // Get all documents in the "tags" collection
  const tagQuery = await getDocs(collection(db, "tags"));
  return tagQuery.docs.map(doc => doc.id); // Return an array of their ids
}

/** Converts an array of tags into a friendly string for display. */
export function unravelTags(tags: string[]): string{
  let unraveledTags = "Tags: "; // Convert tags array to string
  tags.forEach(tags => unraveledTags += tags + ", ");
  return unraveledTags.substring(0, unraveledTags.length - 2);
}