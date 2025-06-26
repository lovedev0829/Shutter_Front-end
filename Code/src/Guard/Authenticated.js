import {useEffect } from 'react';
import {useNavigate } from 'react-router-dom';


const Authenticated = ({ children }) => {
    const token = localStorage.getItem('accessToken')
  const navigate = useNavigate();
  const code = JSON.parse(localStorage.getItem('code'));
  
 useEffect(() => {
  if (!token) {
    navigate(`/${code?code:"admin"}`)
 }

}, [token,navigate,code]);

  return <>
  {children}</>;
};
export default Authenticated;