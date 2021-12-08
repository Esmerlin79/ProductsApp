import React, { createContext, useEffect, useState } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import productApi from "../api/productApi";
import { Producto, ProductsResponse } from "../interfaces/appInterface";


type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: ( categoryId: string, productName: string ) => Promise<Producto>;
    updateProduct: ( categoryId: string, productName: string, productId: string ) => Promise<void>;
    deleteProduct: ( id: string ) => Promise<void>;
    loadProductById: ( id: string ) => Promise<Producto>;
    uploadImage: ( data: ImagePickerResponse, id: string ) => Promise<void>; //TODO: cambiar any
}

export const ProductsContext = createContext({} as ProductsContextProps);


export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {
        const resp = await productApi.get<ProductsResponse>('/productos?limite=50');
        setProducts(resp.data.productos);
    }

    const addProduct = async ( categoryId: string, productName: string ): Promise<Producto> => {
        try {
            const resp = await productApi.post<Producto>('/productos', { 
                nombre: productName, 
                categoria: categoryId 
            });
            setProducts([...products, resp.data ]);
            return resp.data;
        } catch (error) {
            console.log(error)
            return error.response.data;
        }
    }

    const updateProduct = async ( categoryId: string, productName: string, productId: string ) => {
        try {
            const resp = await productApi.put<Producto>(`/productos/${productId}`, { 
                nombre: productName, 
                categoria: categoryId 
            });
    
            setProducts( products.map( product => product._id === productId
                ? product = resp.data : product
            ));

        } catch (error) {
            console.log(error)
        }
    }

    const deleteProduct = async ( id: string ) => {

    }

    const loadProductById = async ( id: string ): Promise<Producto> => {
        const resp = await productApi.get<Producto>(`/productos/${id}`);
        return resp.data;
    }

    const uploadImage = async ( data: ImagePickerResponse, productId: string ) => {
        const file = data.assets?.[0];

        const fileToUpload = {
            uri: file?.uri,
            type: file?.type,
            name: file?.fileName
        }

        const formData = new FormData();
        
        formData.append('archivo', fileToUpload);
        
        try {
            await productApi.put<Producto>(`/uploads/productos/${productId}`, formData);

        } catch (error) {
            console.log(error.message)
        }
    }
    
    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage

        }}>
            { children }
        </ProductsContext.Provider>
    )
}