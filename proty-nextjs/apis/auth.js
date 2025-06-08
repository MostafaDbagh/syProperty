import { Axios } from "axios";


export const signup = async (data) => {
    const response = await Axios.post('auth/signup', data);
    return response.data;
  };
  
  // Sign in an existing user
  export const signin = async (data) => {
    const response = await Axios.post('auth/signin', data);
    return response.data;
  };
  
  // Sign in with Google
  export const googleSignin = async (data) => {
    const response = await Axios.post('auth/google', data);
    return response.data;
  };
  
  // Sign out
  export const signOut = async () => {
    const response = await Axios.get('auth/signout');
    return response.data;
  };