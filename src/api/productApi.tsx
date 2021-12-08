import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://10.0.0.162:8080/api';

const productApi = axios.create({ baseURL });


productApi.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('token');
        if( token ) {
            config.headers['x-token'] = token
        }
        return config;
    }
);

export default productApi;