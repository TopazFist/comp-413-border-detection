import React from "react";

/**
 * Component that renders unauthorized access message and redirects users to the login page.
 */
const Unauthorized = () => {
    return (
        <div style={{fontSize:20}}><strong>401: Unauthorized</strong><br/> Please <a href="/" style={{color:"blue"}}>log in </a> first.</div>
    )
}

export default Unauthorized;
