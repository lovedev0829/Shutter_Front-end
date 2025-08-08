const removeAuth = () =>{
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken');
    localStorage.removeItem('activeTab');
    localStorage.removeItem('activeTab2');
    localStorage.removeItem('ghluser');
    localStorage.removeItem('ImpersonateTenant');
    localStorage.removeItem('userDataold')
    localStorage.removeItem('accessTokenold');
  }
  export {removeAuth}