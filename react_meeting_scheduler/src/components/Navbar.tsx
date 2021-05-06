import React from 'react';

interface Props{
    isLoggedIn?: boolean,
}

const Navbar : React.FC<Props> = (props) => {
    const logged_out_nav = (
            <p>Hello, unauthorised user</p>
    );
    
    const logged_in_nav = (
            <p>Hello, user</p>
    );
    
    return(
        <div>
            {props.isLoggedIn ? logged_in_nav : logged_out_nav}
        </div>
    );
}

export default Navbar;