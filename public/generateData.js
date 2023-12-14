import * as fs from "fs";

import data from "data";

const countries = [];
const states = {};

data.forEach((c) => {
  countries.push(c["name"]);

  const stateList = [];
  c["states"].forEach((s) => {
    stateList.push(s["name"]);
  });

  states[c["name"]] = stateList;
});

fs.writeFile("countries.json", countries, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log("countries.json written correctly");
});

fs.writeFile("states.json", states, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log("states.json written correctly");
});
