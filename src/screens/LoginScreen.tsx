import React, { useContext, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, Text, TextInput, View, TouchableOpacity, Keyboard, Alert } from 'react-native';

import Background from '../components/Background'
import WhiteLogo from '../components/WhiteLogo';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';


interface Props extends StackScreenProps<any, any> {}

const LoginScreen = ({ navigation }: Props) => {

    const { errorMessage, signIn, removeError } = useContext(AuthContext);

    const { email, password, onChange } = useForm({  
        email: '',
        password: ''
    });

    useEffect(() => {
        if( errorMessage.length === 0 ) return;

        Alert.alert('Login incorrecto', errorMessage, [{ 
            text: 'Ok',
            onPress: removeError
        }]);

    }, [errorMessage])

    const onLogin = () => {
        console.log(email);
        Keyboard.dismiss();

        signIn({ correo: email, password });
    }

    return (
        <>
            <Background />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={ loginStyles.formContainer }>
                    <WhiteLogo />

                    <Text style={ loginStyles.title }>Login</Text>

                    <Text style={ loginStyles.label }>Email:</Text>
                    <TextInput 
                        placeholder="Ingrese su email:"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onChangeText={ (value) => onChange(value, 'email')}
                        value={email}
                        onSubmitEditing={ onLogin }
                    />

                    <Text style={ loginStyles.label }>Password:</Text>
                    <TextInput 
                        placeholder="*********"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        secureTextEntry={ true }
                        autoCapitalize="none"
                        autoCorrect={ false }
                        onChangeText={ (value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={ onLogin }
                    />

                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity 
                            activeOpacity={ 0.8 }
                            style={ loginStyles.button }
                            onPress={ onLogin }
                        >
                            <Text style={ loginStyles.buttonText }>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={ loginStyles.newUserContainer }>
                        <TouchableOpacity
                            activeOpacity={ 0.8 }
                            onPress={ () => navigation.replace('RegisterScreen') }
                        >
                            <Text style={ loginStyles.buttonText }>Nueva cuenta </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default LoginScreen
