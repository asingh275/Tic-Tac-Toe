import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import './login.css'
import { auth, provider } from './Github-auth/Firebase';
import { signInWithPopup } from "firebase/auth";

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
        console.log(res)
        props.setLogin(parseJwt(res.credential));
    }

    const onFailure = (res)  => {
        console.log('[Login failed] res: ', res);
    }

    const signInWithGithub = () => {
        signInWithPopup(auth, provider).then(result => {
            props.setLogin(result.user)
        }).catch(error => {
            console.log(error)
        })
    }   

    return (
        <>
            <div className="px-4 py-5 text-center h-100">
                <div className="container shadow rounded mt-5">
                    <div className="row  ">
                        <div className="col md-6 p-0 text-start">
                           <div className="card left bg-dark">
                                <div className="card-body px-4 py-5 text-white">
                                    <h1 className="mb-5">App title</h1>
                                    <h4>Subheader</h4>
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

                                    

                                    <div className="row px-2 ms-1 mt-3">
                                        
                                            <GoogleLogin
                                                onSuccess={onSuccess}
                                                onError={onFailure}
                                                theme={"filled_black"}
                                            
                                             />
                                       
                                        

                                         <div className="row px-4 mb-3 mt-3 text-start">
                                            <button className="btn btn-dark" onClick={signInWithGithub}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github me-3" viewBox="0 0 16 16">
                                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                                </svg>
                                                Log in with Github
                                            </button>
                                        </div>
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