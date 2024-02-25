const url = `http://localhost:5000`;

 function getJSONdata () {
  return fetch(`${url}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export { getJSONdata }