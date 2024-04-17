import React from 'react';

const Unauthorized = () => {
    return (
        <div style={{fontSize:20}}><strong>401: Unauthorized</strong><br/> Please <a href="/" style={{color:"blue"}}>log in </a> first.</div>
    )
}

export default Unauthorized;