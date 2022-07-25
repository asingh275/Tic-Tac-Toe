import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const Login = (props) =>{

    // function to parse jwt token returned after login to get user data
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
       var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
       }).join(''));
     
       return JSON.parse(jsonPayload);
     };

    const onSuccess = (res) => {
        props.setLogin(parseJwt(res.credential));
    }

    const onFailure = (res)  => {
        console.log('[Login failed] res: ', res);
    }
    return (
        <div>
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}
            />
        </div>
    );
};

export default Login;