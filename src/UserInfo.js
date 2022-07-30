import React from 'react'

const UserInfo = ({user}) => {
  return (
    <div className="user-card me-3">
        <div className="user-info d-flex align-items-center">
            <img className="profile-image" src={user.photoURL} alt="User photo" />
            <div class="ms-3">
				<h5 class="user-name">{user.displayName.replace('"', '')}</h5>
				<p class="user-mail">{user.email}</p>
			</div>
        </div>
    </div>  
  )
}

export default UserInfo