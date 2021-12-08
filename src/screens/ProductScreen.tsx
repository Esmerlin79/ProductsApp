import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { ProductsStackParams } from '../navigator/ProductsNavigator'
import useCategories from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

const ProductScreen = ({ route, navigation }: Props) => {

    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext);

    const { id = '', name = 'null' } = route.params;

    const [tempUri, setTempUri] = useState<string>();

    const { isLoading, categories } = useCategories();


    const { _id, categoryId, productName, img, onChange, setFormValue } = useForm({
        _id: id,
        categoryId: '',
        productName: '',
        img: ''
    })

    useEffect(() => {
       navigation.setOptions({
           title: name !== 'null'
                ? (productName.length === 0) ? 'Sin nombre de producto' : productName
                : 'Nuevo producto'
       })
    }, [productName])

    useEffect(() => {
        loadProduct();
    }, [])

    const loadProduct = async () => {
        if( id.length === 0 ) return;

        const product = await loadProductById( id );
        setFormValue({
            _id: id,
            categoryId: product.categoria._id,
            productName: product.nombre,
            img: product.img || ''
        })
    }

    const saveOrUpdate = async () => {
        if( id.length > 0 ) {
            updateProduct( categoryId, productName, id );
        } else {
            const tempCategoryId = categoryId || categories[0]._id;
            const newProduct = await addProduct( tempCategoryId, productName );
            onChange(newProduct._id, '_id');
        }

    }

    const takePhoto = async () => { 
         launchCamera({ mediaType: 'photo', quality: 0.5 }, (resp) => {
             if( resp.didCancel ) return;
             if( !resp.assets?.[0].uri ) return;

             setTempUri( resp.assets?.[0].uri );
             uploadImage(resp, _id);
         });
    }

    const takePhotoFromGallery = async () => { 
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (resp) => {
            if( resp.didCancel ) return;
            if( !resp.assets?.[0].uri ) return;

            setTempUri( resp.assets?.[0].uri );
            uploadImage(resp, _id);
        });
   }

    return (
        <View style={ styles.container }>
            <ScrollView>

                <Text style={ styles.label }>Nombre del producto:</Text>
                <TextInput 
                    placeholder="Producto"
                    style={ styles.textInput }
                    onChangeText={ (value) => onChange(value, 'productName')}
                    value={productName}
                />

                <Text style={ styles.label }>Categoria:</Text>
                { !isLoading ? (
                    <Picker
                        selectedValue={categoryId}
                        onValueChange={(value) =>  onChange(value, 'categoryId')}
                    >   
                        { categories.map( c => (
                            <Picker.Item 
                                key={c._id} 
                                label={c.nombre} 
                                value={c._id} 
                            />
                        ))}
                    </Picker>
                ): <ActivityIndicator size={ 30 } color="black" /> }

                <Button 
                    title="Guardar"
                    onPress={ saveOrUpdate }
                    color="#5856D6"
                />

                { _id.length > 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}> 
                        <Button 
                            title="Camara"
                            onPress={ takePhoto }
                            color="#5856D6"
                        />

                        <View style={{ width: 10 }} />

                        <Button 
                            title="Galeria"
                            onPress={ takePhotoFromGallery }
                            color="#5856D6"
                        />
                    </View>
                )}

                
                { img.length > 0  && !tempUri && (
                    <Image 
                        source={{ uri: img }}
                        style={{
                            marginTop: 20,
                            width: '100%',
                            height: 300,
                        }}
                    />     
                )}

                  
                { tempUri  && (
                    <Image 
                        source={{ uri: tempUri }}
                        style={{
                            marginTop: 20,
                            width: '100%',
                            height: 300,
                        }}
                    />     
                )}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18,
        color: '#000',
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 15
    }    
});

export default ProductScreen
