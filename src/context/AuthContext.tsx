import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import productApi from "../api/productApi";
import { LoginData, LoginResponse, RegisterData, Usuario } from "../interfaces/appInterface";
import { authReducer, AuthState } from "./authReducer";

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'no-authenticated';
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async () => {
       const token = await AsyncStorage.getItem('token');

       if( !token ) return dispatch({ type: 'noAuthenticated' });

       const resp = await productApi.get<LoginResponse>('/auth/');

       if( resp.status !== 200 ) return dispatch({ type: 'noAuthenticated' });

       await AsyncStorage.setItem('token', resp.data.token);
       dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario
            }
        })
    }

    const signUp = async ({ nombre, correo, password }: RegisterData) => {
        try {
            const { data } = await productApi.post<LoginResponse>('/usuarios', { nombre, correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            })

            await AsyncStorage.setItem('token', data.token);

        } catch (error) {
            console.log(error);
            dispatch({
                type: 'addError',
                payload: error.response.data.errors[0].msg || 'Informacion incorrecta'
            })
        }
    }

    const signIn = async ({ correo, password }: LoginData ) => {
        try {
            const { data } = await productApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            })

            await AsyncStorage.setItem('token', data.token);

        } catch (error) {
            console.log(error);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Informacion incorrecta'
            })
        }
    }

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    }

    const removeError = () => {
        dispatch({ type: 'removeError' });
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            { children}
        </AuthContext.Provider>
    )
}

