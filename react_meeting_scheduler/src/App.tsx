import React, {Component} from 'react';
import axios from 'axios';
import Dashboard from "./components/Dashboard";
import Navbar from './components/Navbar';
import {makeStyles} from "@material-ui/core/styles";

// interface Props {
//     isLoggedIn?: boolean,
// }

// const Navbar: React.FC<Props> = (props) => {
//     const logged_out_nav = (
//         <p>Hello, unauthorised user</p>
//     );
//
//     const logged_in_nav = (
//         <p>Hello, user</p>
//     );
//
//
//     return (
//         <div>
//             {props.isLoggedIn ? logged_in_nav : logged_out_nav}
//         </div>
//     );
// }

const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    }
})
// if (!isAuthenticated()) {
//     return <Redirect to="/" />;
//   }

class App extends Component {

    render() {

        return (
            <div className="App">
                {/*<Navbar />*/}
                <Dashboard />
            </div>
        )
    }

    simplePOST = async () => {
        try {
            let res = await authAxios.post(
                "/dj-rest-auth/token/verify/",
                {
                    token: localStorage.getItem("access_token"),
                }
            );
            console.log(res);
            return res.status;
        } catch (err) {
            console.log(err.message);
        }
    };

}

export default App;