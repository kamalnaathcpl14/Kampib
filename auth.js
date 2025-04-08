// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } 
from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaBeXSDnDt2Fy5M323rd351TADllFstTc",
    authDomain: "kampibdb.firebaseapp.com",
    projectId: "kampibdb",
    storageBucket: "kampibdb.firebasestorage.app",
    messagingSenderId: "476887652024",
    appId: "1:476887652024:web:7773176f2095c2627fc64d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Sign Up Function
window.signUp = function () {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Send email verification
            sendEmailVerification(userCredential.user)
                .then(() => {
                    alert("Account created! Please check your email to verify your account before logging in.");
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    alert("Account created, but we couldn't send a verification email. Please try logging in later.");
                });
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Login Function
window.login = function () {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Check if email is verified
            if (userCredential.user.emailVerified) {
                alert("Login Successful!");
                
                // Store user info in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', userCredential.user.email);
                const displayName = userCredential.user.displayName || userCredential.user.email.split('@')[0];
                localStorage.setItem('userName', displayName);
                localStorage.setItem('userPhoto', userCredential.user.photoURL || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff`);
                localStorage.setItem('emailVerified', 'true');
                
                // Redirect to home page
                window.location.href = '../../index.html';
            } else {
                // Sign out the unverified user
                auth.signOut();
                
                // Show verification required message
                alert("Please verify your email before logging in. A verification link was sent to your email address.");
                
                // Option to resend verification email
                if (confirm("Would you like us to resend the verification email?")) {
                    sendEmailVerification(userCredential.user)
                        .then(() => {
                            alert("Verification email sent! Please check your inbox.");
                        })
                        .catch((error) => {
                            alert("Error sending verification email: " + error.message);
                        });
                }
            }
        })
        .catch((error) => {
            alert(error.message);
        });
};

// Forgot Password Function
window.forgotPassword = function () {
    let email = document.getElementById("email").value;
    
    if (!email) {
        alert("Please enter your email address");
        return;
    }
    
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent! Check your inbox.");
        })
        .catch((error) => {
            let errorMessage = "Error sending reset email.";
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = "No account found with this email address.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many attempts. Please try again later.";
                    break;
            }
            
            alert(errorMessage);
        });
};

// Google Sign-In Function
window.googleSignIn = function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            // Check if email is verified (Google accounts are pre-verified)
            if (result.user.emailVerified) {
                // Store user info
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', result.user.email);
                localStorage.setItem('userName', result.user.displayName || result.user.email.split('@')[0]);
                localStorage.setItem('userPhoto', result.user.photoURL || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.displayName || '')}&background=2563eb&color=fff`);
                localStorage.setItem('emailVerified', 'true');
                
                // Create a container for the success message
                const successContainer = document.createElement('div');
                successContainer.id = 'login-success';
                successContainer.style.textAlign = 'center';
                successContainer.style.marginTop = '20px';

                // Create the success message and button with enhanced styles
                successContainer.innerHTML = `
                    <h2 style="color: #28a745;">Login Successful!</h2>
                    <button onclick="window.location.href='/index.html'" style="
                        padding: 10px 20px; 
                        font-size: 16px; 
                        background-color: #007bff; 
                        color: white; 
                        border: none; 
                        border-radius: 5px; 
                        cursor: pointer; 
                        transition: background-color 0.3s;">
                        Go to Home
                    </button>
                `;

                // Append the success message to the body
                document.body.appendChild(successContainer);

                // Hide the Google sign-in button
                document.querySelector('.google-btn').style.display = 'none';
            } else {
                // This is unlikely to happen with Google Sign-In as Google accounts are typically pre-verified
                alert("Please verify your email before logging in.");
                auth.signOut();
            }
        })
        .catch((error) => {
            alert(error.message);
        });
};
