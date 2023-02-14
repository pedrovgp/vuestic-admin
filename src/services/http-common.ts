import axios from 'axios'

const BASE_API_ENDPOINT = window.location.protocol + '//' + window.location.host

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

export default axios.create({
  baseURL: BASE_API_ENDPOINT + '/_api/v1',
  headers: {
    'Content-type': 'application/json',
  },
})
