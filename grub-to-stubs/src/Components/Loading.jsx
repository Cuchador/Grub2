import React from 'react';
import './Loading.css'; 
import loadingImage from './Grub2StubsLogo.png';

const Loading = () => {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <img src={loadingImage} alt="Loading" />
        </div>
        <p>Loading...</p>
      </div>
    );
  };
  
  export default Loading;
