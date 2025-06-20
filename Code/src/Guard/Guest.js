import {useEffect } from 'react';
import {useNavigate } from 'react-router-dom';

const Guest = ({ children }) => {
    const token = localStorage.getItem('accessToken')
  const navigate = useNavigate();
  
 useEffect(() => {
  if (token) {
    navigate('/dashboard')
 }
}, [token,navigate]);



  return <>
  {children}</>;
};
export default Guest;