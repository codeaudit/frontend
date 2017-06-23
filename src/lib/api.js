import fetch from 'isomorphic-fetch';

export function login(email, redirect = '/') {
  const endpoint = `/api/users/new_login_token`;
  const body = { email, redirect };
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return fetch(endpoint, {
    method: 'post',
    headers,
    body: JSON.stringify(body),
  })
  .then(checkStatus)
  .then(json => {
    console.log(">>> json", json);
    return json;
  });
}

export function logout() {
  window.localStorage.removeItem('accessToken');
  window.location.replace(window.location.href);
}

/**
 * The Promise returned from fetch() won't reject on HTTP error status. We
 * need to throw an error ourselves.
 */
export function checkStatus(response) {
  const { status } = response;

  if (status >= 200 && status < 300) {
    return response.json();
  } else {
    return response.json()
    .then((json) => {
      const error = new Error(json.error.message);
      error.json = json;
      error.response = response;
      throw error;
    });
  }
}
