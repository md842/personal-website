import {type ReactNode, useEffect, useState} from "react";

import GradientScroll from '../components/GradientScroll';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

interface LeetCodeSortable{
  id: number; // Problem number
  diff: number; // Problem difficulty (0 = Easy, 1 = Medium, 2 = Hard)
  lang: number; // Submission programming language (0 = C, 1 = C++, 2 = Python)
  runtimeBeats: number; // Percentage of submissions with worse runtime
  memoryBeats: number; // Percentage of submissions with worse memory usage

  // Initialized in useEffect hook
  score: number; // Weighted score = (2 * runtimeBeats + memoryBeats) / 3
}

interface LeetCodeSubmission{
  sortable: LeetCodeSortable; // Sortable elements of the submission

  runtime: number; // In ms; not sortable because it means little by itself
  memory: number; // In MB; not sortable because it means little by itself
  title: string; // The name of the LeetCode problem
  url: string; // The submission URL
}

export default function LeetCode(): ReactNode{
  // Placeholder items to be replaced later
  let exampleItem1: LeetCodeSubmission = {
    sortable: {
      id: 2906,
      diff: 1,
      lang: 2,
      runtimeBeats: 75.72,
      memoryBeats: 54.91
    } as LeetCodeSortable,
    runtime: 108,
    memory: 44.33,
    title: "Construct Product Matrix",
    url: "https://leetcode.com/problems/construct-product-matrix/submissions/1957261727/"
  }

  let exampleItem2: LeetCodeSubmission = {
    sortable: {
      id: 1594,
      diff: 1,
      lang: 2,
      runtimeBeats: 82.99,
      memoryBeats: 56.89
    } as LeetCodeSortable,
    runtime: 3,
    memory: 19.35,
    title: "Maximum Non Negative Product in a Matrix",
    url: "https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix/submissions/1957102517"
  }

  let exampleItem3: LeetCodeSubmission = {
    sortable: {
      id: 3546,
      diff: 1,
      lang: 2,
      runtimeBeats: 84.25,
      memoryBeats: 41.1
    } as LeetCodeSortable,
    runtime: 106,
    memory: 46.72,
    title: "Equal Sum Grid Partition I",
    url: "https://leetcode.com/problems/equal-sum-grid-partition-i/submissions/1958355260"
  }

  // Populates the table. Can be sorted by sortByKey()
  const [items, setItems] = useState([exampleItem1, exampleItem2, exampleItem3]);

  useEffect(() => { // Initialize weighted scores and apply default sort
    items.forEach((item) => { // Initialize weighted scores
      // Weighted score = (2 * runtimeBeats + memoryBeats) / 3
      item.sortable.score = (2 * item.sortable.runtimeBeats + item.sortable.memoryBeats) / 3
      // Round to 2 decimal places
      item.sortable.score = Math.round(item.sortable.score * 100) / 100
    });

    sortByKey("score", true); // Default sort: descending weighted score
  }, []); // Runs on mount

  // Provides dynamic colors for the Runtime Beats and Memory Beats columns
  const colorScale: string[] = [
    "#DC3545", // [0%, 12.5%)   = var(--bs-red)
    "#FD7E14", // [12.5%, 25%)
    "#FFC107", // [25%, 37.5%)  = var(--bs-yellow)
    "#D1B516", // [37.5%, 50%)
    "#A3AA26", // [50%, 62.5%)
    "#759E35", // [62.5%, 75%)
    "#479345", // [75%, 87.5%)
    "#198754"  // [87.5%, 100%] = var(--bs-green)
  ]

  // Table headers are populated using map to reuse code for all columns
  const tableHeaders: {key: keyof LeetCodeSortable, label: string}[] = [
    {key: "id", label: "Problem"},
    {key: "diff", label: "Difficulty"},
    {key: "lang", label: "Language"},
    {key: "runtimeBeats", label: "Runtime (Beats)"},
    {key: "memoryBeats", label: "Memory (Beats)"},
    {key: "score", label: "Weighted Score"}
  ]

  /** Helper function that re-renders the table sorted by key; ascending order
   *  by default, descending order if reverse = true. Called when a sort button
   *  on any column of the table header is clicked.
   */
  function sortByKey(key: keyof LeetCodeSortable, reverse?: boolean){
    setItems([...
      items.sort((obj1, obj2) => {
      let a = obj1.sortable[key], b = obj2.sortable[key];
        return reverse ? b - a : a - b;
      })
    ]);
  }

  return(
    <main>
      <p>Page under construction!</p>
      <p>
        Below is a sortable collection of all of my LeetCode submissions.
        Click on a problem name to be taken to the submission on LeetCode
        (opens in a new tab).
      </p>
      <p>
        Weighted score follows the formula
        (2 * runtime percentile + memory percentile) / 3.
      </p>

      <GradientScroll
        gradWidth="0.5rem"
        endColor="var(--bs-body-bg)"
      >
        <Table responsive>
          <thead>
            <tr>
              {tableHeaders.map((header) => ( // Populate table header columns
                <th key={header.key}
                  // Enforce min width for "Problem" column only
                  style={header.key == "id" ? {minWidth: "160px"} : {}}
                >
                  <div className="d-flex align-items-center">
                    {header.label}
                    <div className="d-flex flex-column ms-2">
                      <Button variant="link"
                        className="p-0 lh-1 d-flex align-items-center"
                        onClick={() => sortByKey(header.key)} // Ascending
                      >
                        <i className="bi bi-caret-up-fill"
                          style={{fontSize: "0.5rem"}}
                        />
                      </Button>
                      <Button variant="link"
                        className="p-0 lh-1 d-flex align-items-center"
                        onClick={() => sortByKey(header.key, true)} // Descending
                      >
                        <i className="sort-btn bi bi-caret-down-fill"
                          style={{fontSize: "0.5rem"}}
                        />
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => ( // Populate table rows
              <tr key={item.sortable.id}>
                <td> {/* "Problem" column */}
                  <a href={item.url} target="_blank">{item.sortable.id}. {item.title}</a>
                </td>

                {/* "Difficulty" column */}
                <td className={"text-" + ( // Bootstrap text color classes
                    item.sortable.diff == 0 ? "success" : // Green
                    item.sortable.diff == 1 ? "warning" : // Yellow
                    "danger"                     // Red
                  )}
                >
                  {
                    item.sortable.diff == 0 ? "Easy" :
                    item.sortable.diff == 1 ? "Medium" : "Hard"
                  }
                </td>

                <td> {/* "Language" column */}
                  { // Set programming language text based on number
                    item.sortable.lang == 0 ? "C" :
                    item.sortable.lang == 1 ? "C++" :
                    item.sortable.lang == 2 ? "Python" : "Other"
                  }
                </td>

                <td> {/* Runtime (Beats) column */}
                  {/* Use <wbr/> to encourage wrap after "ms" if necessary */}
                  {item.runtime} ms&nbsp;<wbr/>
                  {/* Convert item.runtimeBeats to an index of colorScale (0-7) */}
                  <span style={{color: colorScale[Math.min(7, item.sortable.runtimeBeats / 12.5 | 0)]}}>
                    ({item.sortable.runtimeBeats}%)
                  </span>
                </td>

                <td> {/* Memory (Beats) column */}
                  {/* Use <wbr/> to encourage wrap after "MB" if necessary */}
                  {item.memory} MB&nbsp;<wbr/>
                  {/* Convert item.memoryBeats to an index of colorScale (0-7) */}
                  <span style={{color: colorScale[Math.min(7, item.sortable.memoryBeats / 12.5 | 0)]}}>
                    ({item.sortable.memoryBeats}%)
                  </span>
                </td>

                {/* Convert item.score to an index of colorScale (0-7) */}
                <td style={{color: colorScale[Math.min(7, item.sortable.score / 12.5 | 0)]}}>
                  {item.sortable.score}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </GradientScroll>
    </main>
  );
}