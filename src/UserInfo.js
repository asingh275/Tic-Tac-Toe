import React from 'react'

const UserInfo = (props) => {
  
    if(props.user) {
        return ( 
            
        
            <div className="user-card me-3">
                <div className="user-info d-flex align-items-center">
                    <img className="profile-image" src={props.user.photoURL ? props.user.photoURL : "https://nwsid.net/wp-content/uploads/2015/05/dummy-profile-pic.png"} alt="User photo" />
                    <div class="ms-3">
				        <h5 class="user-name">{props.user.displayName ? props.user.displayName.replace('"', '') : props.user}</h5>
				        <p class="user-mail">{props.user.email ? props.user.email : ""}</p>
			        </div>
                </div>
            </div> 
         )
    } else {
        return ( 
        
            <div className="user-card me-3">
                
                <div className="user-info d-flex align-items-center">
                    <img className="profile-image" src="https://nwsid.net/wp-content/uploads/2015/05/dummy-profile-pic.png" alt="User photo" />
                    <div class="ms-3">
				        <h5 class="user-name">Waiting for opponent...</h5>
				        <p class="user-mail"></p>
			        </div>
                </div>
            </div> 
         )
    }

   
  
}

export default UserInfo