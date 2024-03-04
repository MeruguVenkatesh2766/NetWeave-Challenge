// const url = `http://localhost:5000`;
const url = `https://netweave-challenge.onrender.com`;

 function getJSONdata () {
  return fetch(`${url}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export { getJSONdata }