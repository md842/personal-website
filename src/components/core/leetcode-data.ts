import {collection, getDocs} from "firebase/firestore";
import db from '../firebaseConfig.ts';

export interface LCSort{
  id: number; // LeetCode problem number.
  diff: number; // Problem difficulty (0 = Easy, 1 = Medium, 2 = Hard)
  lang: number; // Submission programming language (0 = C, 1 = C++, 2 = Python)
  timeP: number; // Percentage of submissions with worse runtime
  memP: number; // Percentage of submissions with worse memory usage

  // Initialized in useEffect hook
  score: number; // Weighted score = (2 * runtimeBeats + memoryBeats) / 3
}

export interface LCSub{
  sort: LCSort; // Sortable elements of the submission

  time: number; // In ms; not sortable because it means little by itself
  mem: number; // In MB; not sortable because it means little by itself
  title: string; // The name of the LeetCode problem
  sub: number; // The submission ID
}

/** Reads projects from the database and returns a 2D array of Project objects.
 *  Index 0 contains featured projects, index 1 contains other projects. */
export async function getLeetCode(): Promise<LCSub[]>{
  let lcData: LCSub[] = [];

  // Get all documents in the "leetcode" collection
  const dbQuery = await getDocs(collection(db, "leetcode"));
  dbQuery.forEach((doc) => {
    // Construct a LCSub object for each document
    let lcObj: LCSub = doc.data() as LCSub;
    lcObj.sort.id = Number(doc.id);

    // Initialize weighted score: (2 * timeP + memP) / 3
    // Difficulty multiplier: Easy = 1.0, Medium = 1.1, Hard = 1.2
    lcObj.sort.score = (2 * lcObj.sort.timeP + lcObj.sort.memP) / 3 * (1 + lcObj.sort.diff / 10);
    // Round to 2 decimal places
    lcObj.sort.score = Math.round(lcObj.sort.score * 100) / 100

    lcData.push(lcObj);
  });

  // Apply default sort: weighted score, descending order
  lcData.sort((obj1, obj2) => obj2.sort.score - obj1.sort.score);
  return lcData;
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