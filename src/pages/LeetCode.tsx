import {type ReactNode, useEffect, useState} from "react";

import GradientScroll from '../components/GradientScroll';
import {type LCSort, type LCSub, getLeetCode} from '../components/core/leetcode-data.ts';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function LeetCode(): ReactNode{
  // Populates the table. Can be sorted by sortByKey()
  const [items, setItems] = useState([] as LCSub[]);

  useEffect(() => {
    getLeetCode() // Perform database read on mount
      .then(data => setItems(data))
      .catch(error => console.log("Database error:", error));
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
  const tableHeaders: {key: keyof LCSort, label: string}[] = [
    {key: "id", label: "Problem"},
    {key: "diff", label: "Difficulty"},
    {key: "lang", label: "Language"},
    {key: "timeP", label: "Runtime (Beats)"},
    {key: "memP", label: "Memory (Beats)"},
    {key: "score", label: "Weighted Score"}
  ]

  /** Helper function that re-renders the table sorted by key; ascending order
   *  by default, descending order if reverse = true. Called when a sort button
   *  on any column of the table header is clicked.
   */
  function sortByKey(key: keyof LCSort, reverse?: boolean){
    setItems([...
      items.sort((obj1, obj2) => {
      let a = obj1.sort[key], b = obj2.sort[key];
        return reverse ? b - a : a - b;
      })
    ]);
  }

  return(
    <main>
      <p>
        Below is a sortable collection of all of my LeetCode submissions.
        Click on a problem name to be taken to the submission on LeetCode
        (opens in a new tab).
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
                    {header.key == "score" && // Tooltip for "Weighted Score"
                      <i className="ms-2 bi bi-info-circle-fill"
                        title="Weighted Score = (2 * runtime% + memory%) / 3"
                      />
                    }
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
              <tr key={item.sort.id}>
                <td> {/* "Problem" column */}
                  <a target="_blank"
                    href={ // Build URL using problem title and submission ID
                      "https://leetcode.com/problems/" +
                      item.title.toLowerCase().replace(/\s/g, '-') +
                      "/submissions/" + item.sub
                    }
                  >{item.sort.id}. {item.title}</a>
                </td>

                {/* "Difficulty" column */}
                <td className={"text-" + ( // Bootstrap text color classes
                    item.sort.diff == 0 ? "success" : // Green
                    item.sort.diff == 1 ? "warning" : // Yellow
                    "danger"                              // Red
                  )}
                >
                  {
                    item.sort.diff == 0 ? "Easy" :
                    item.sort.diff == 1 ? "Medium" : "Hard"
                  }
                </td>

                <td> {/* "Language" column */}
                  { // Set programming language text based on number
                    item.sort.lang == 0 ? "C" :
                    item.sort.lang == 1 ? "C++" :
                    item.sort.lang == 2 ? "Python" : "Other"
                  }
                </td>

                <td> {/* Runtime (Beats) column */}
                  {/* Use <wbr/> to encourage wrap after "ms" if necessary */}
                  {item.time} ms&nbsp;<wbr/>
                  {/* Convert item.timeP to an index of colorScale (0-7) */}
                  <span style={{color: colorScale[Math.min(7, item.sort.timeP / 12.5 | 0)]}}>
                    ({item.sort.timeP}%)
                  </span>
                </td>

                <td> {/* Memory (Beats) column */}
                  {/* Use <wbr/> to encourage wrap after "MB" if necessary */}
                  {item.mem} MB&nbsp;<wbr/>
                  {/* Convert item.memP to an index of colorScale (0-7) */}
                  <span style={{color: colorScale[Math.min(7, item.sort.memP / 12.5 | 0)]}}>
                    ({item.sort.memP}%)
                  </span>
                </td>

                {/* Convert item.score to an index of colorScale (0-7) */}
                <td style={{color: colorScale[Math.min(7, item.sort.score / 12.5 | 0)]}}>
                  {item.sort.score}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </GradientScroll>
    </main>
  );
}