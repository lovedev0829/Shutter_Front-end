import axios from 'axios';

const axiosInt = axios.create();

axiosInt.interceptors.response.use(
  (response) => response,
  (error) =>
{
  console.log(error)
}
    // Promise.reject(
    //   (error.response && error.response.data) || 'There is an error!'
    // )
);

export default axiosInt;
