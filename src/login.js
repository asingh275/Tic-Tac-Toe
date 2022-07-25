import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import './login.css'

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
        console.log((parseJwt(res.credential)));
    }

    const onFailure = (res)  => {
        console.log('[Login failed] res: ', res);
    }
    return (
        <>
            <div className="px-4 py-5 text-center h-100">
                <div className="container shadow rounded mt-5">
                    <div className="row  ">
                        <div className="col md-6 p-0 text-start">
                           <div className="card left bg-dark">
                                <div className="card-body px-4 py-5 text-white">
                                    <h1>App title</h1>
                                    <h3>Subheader</h3>
                                    <p className="mb-0">Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                    olestias laudantium exercitationem quam illum earum totam,
                                    commodi a alias, distinctio adiasdasdaasdasdpisci dolore tempora. Aperiam,
                                    laborum eius expedita maxime unde laboriosaasdasdasdasdasdasdasdasdm reprehenderit.</p>
                                </div>
                                
                          </div>
                            
                        </div>
                        <div className="col md-6 p-0">
                            <div className="card right">
                                <div className="card-body px-4 py-5">
                                    <div className="row px-4 text-start">
                                        <h3>Welcome</h3>
                                    </div>
                                    <div className="row px-4 mb-3 text-start">
                                        <p className="lead">Log in to continue</p>
                                    </div>

                                    

                                    <div className="row px-2 ms-1 mt-3 google-login">
                                        <GoogleLogin
                                            onSuccess={onSuccess}
                                            onError={onFailure}
                                            size={"large"}
                                            width={400}
                                            theme={"filled_black"}
                                            
                                         />
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    );
};

export default Login;