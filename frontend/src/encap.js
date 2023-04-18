/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} request A Request object.
 */
const getJSON = (request) =>
  fetch(request)
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.warn(`API_ERROR: ${err.message}`));

// Define the url of the server
const url = 'http://localhost:5005';

/**
 * @param {String} path The request endpoint path.
 * @param {String} token The access token.
 * @param {String} method The HTTP method.
 * @param {String} urlParameters The URL query parameters.
 * @param {Object} data The data to send in the request body.
 */
export default function encapFetch (path, token = '', method, urlParameters = '', data = null) {
  const structure = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    structure.Authorization = `Bearer ${token}`;
  }

  const defaultSetting = {
    method,
    headers: new Headers(structure),
    mode: 'cors',
    cache: 'default',
    ...(data && { body: JSON.stringify(data) }),
  };

  const request = new Request(`${url}/${path}${urlParameters}`, defaultSetting);
  return (
    method === 'POST'
      ? fetch(request).then((res) => {
        return res;
      })
      : getJSON(request)
  ).catch((err) => console.warn(`API_ERROR: ${err.message}`));
}
