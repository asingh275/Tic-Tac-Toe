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
            <div className="px-4 py-5 text-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h1>App title here</h1>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                            olestias laudantium exercitationem quam illum earum totam,
                            commodi a alias, distinctio adipisci dolore tempora. Aperiam,
                            laborum eius expedita maxime unde laboriosam reprehenderit.</p>
                        </div>
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="card">
                                <div className="card-body px-4 py-5">
                                    <div className="row px-4 text-start">
                                        <h2>Welcome</h2>
                                    </div>
                                    <div className="row px-4 mb-3 text-start">
                                        <p className="lead">Log in to continue</p>
                                    </div>

                                    <div className="row">
                                        <form action="">
                                            <div className="row">
                                                <div class="form-floating my-3 px-4">
                                                    <input type="email" class="form-control" id="floatingInput" placeholder="email" />
                                                    <label className="ms-4" for="floatingInput">Email address</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div class="form-floating mt-2 mb-3 px-4">
                                                    <input type="password" class="form-control" id="floatingPassword" placeholder="password" />
                                                    <label className="ms-4" for="floatingInput">Password</label>
                                                </div>
                                            </div>
                                            <div className="row px-4 mt-2">
                                                <button class="btn btn-primary btn-lg" type="submit">Log in</button>
                                            </div>
                                        </form>

                                    </div>

                                    <div className="row px-2 mt-5 google-login">
                                        <GoogleLogin
                                            onSuccess={onSuccess}
                                            onError={onFailure}
                                            size={"large"}
                                            width={400}
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