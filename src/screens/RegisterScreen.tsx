import React, { useContext, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, Text, TextInput, View, TouchableOpacity, Keyboard, Alert } from 'react-native';

import WhiteLogo from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

const RegisterScreen = ({ navigation }: Props) => {

    const { errorMessage, signUp, removeError } = useContext(AuthContext);

    const { name, email, password, onChange } = useForm({  
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if(errorMessage.length === 0 ) return;

        Alert.alert('Registro incorrecto', errorMessage, [{
            text: 'Ok',
            onPress: removeError
        }])

    }, [errorMessage])

    const onRegister = () => {
        console.log(email);
        Keyboard.dismiss();

        signUp({ nombre: name, correo: email, password });
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#5856D6' }}
                behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={ loginStyles.formContainer }>
                    <WhiteLogo />

                    <Text style={ loginStyles.title }>Registro</Text>

                    <Text style={ loginStyles.label }>Nombre:</Text>
                    <TextInput 
                        placeholder="Ingrese su nombre:"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                        ]}
                        selectionColor="white"
                        autoCapitalize="words"
                        autoCorrect={ false }
                        onChangeText={ (value) => onChange(value, 'name')}
                        value={name}
                        onSubmitEditing={ onRegister }
                    />


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
                        onSubmitEditing={ onRegister }
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
                        onSubmitEditing={ onRegister }
                    />

                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity 
                            activeOpacity={ 0.8 }
                            style={ loginStyles.button }
                            onPress={ onRegister }
                        >
                            <Text style={ loginStyles.buttonText }>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>

                   <TouchableOpacity
                        onPress={ () => navigation.replace('LoginScreen') }
                        activeOpacity={ 0.8 }
                        style={ loginStyles.buttonBack }
                   >
                       <Text style={ loginStyles.buttonText }>Login </Text>
                   </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </>
    )
}

export default RegisterScreen
