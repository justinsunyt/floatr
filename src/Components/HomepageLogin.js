import React from 'react'
import {Link, Redirect, withRouter} from 'react-router-dom'
import firebase from 'firebase'



    

function Homepage()
{
    var provider = new firebase.auth.GoogleAuthProvider();

    return(
        <div>
            
            <center>
            <h1>Welcome to TaskFloat</h1>
            <p>Please Login with your Google Account to continue</p>
            <button onClick={
            function()
            {
                firebase.auth().signInWithPopup(provider).then(function(result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
              

                    // once logged in do stuff
                   
                   

                  }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                  });
            }

            }>Login</button>
            </center>
            <body>

            
            </body>
        </div>
      
    )
       
}
export default Homepage