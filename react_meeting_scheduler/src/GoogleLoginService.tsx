import axios from "axios";


const sendToken = async(profileInfo : any) => {

    let res = await axios.post(

        "http://127.0.0.1:8000/api/dj-rest-auth/google/",
        {
            access_token: profileInfo.accessToken,
            id_token: profileInfo.tokenId
        }
    );
    console.log(res);
    return res.status;
};


export default sendToken;