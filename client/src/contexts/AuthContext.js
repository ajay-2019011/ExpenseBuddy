import React, { useContext, useEffect, useState } from 'react';
import firebase from '../services/firebase';

const AuthContext=React.createContext();

export function useAuth()
{
    return useContext(AuthContext);
}

export function AuthProvider({children})
{
    const [currentUser,setCurrentUser]=useState('');
    
    function signup(email,password)
    {
        return firebase.auth().createUserWithEmailAndPassword(email,password)
    }

    function login(email,password)
    {
        return firebase.auth().signInWithEmailAndPassword(email,password)
    }

    async function logout()
    {
        await localStorage.removeItem('uid');
        return firebase.auth().signOut();
    }

    useEffect(()=>{
        const unsubscribe=firebase.auth().onAuthStateChanged(user=>{
            setCurrentUser(user)
        });
        return unsubscribe;
    },[]);

    const value={currentUser,signup,login,logout};

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}