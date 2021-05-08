import axios from "axios";
import { profile } from "node:console";
import React from "react";

interface Props{

}

const sendToken = async(profileInfo : any) => {
    console.log(profileInfo);

    try{
    let res = await axios.post(
        "http://127.0.0.1:8000/dj-rest-auth/google/",
        {
            access_token: profileInfo.accessToken,
            id_token: profileInfo.tokenId,
        }
    );
    console.log(res.data);
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);


    return res;
    } catch(err){
        console.log(err.message);
    }
    
};

export default sendToken;