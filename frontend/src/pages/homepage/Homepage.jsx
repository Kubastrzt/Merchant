import React, {useEffect, useState} from 'react';
import Container from "../../components/ui/container";
import Billboard from "../../components/Billboard/Billboard";
import {getBillboard} from "../../api-calls/get-billboard";
import {getBillboards} from "../../api-calls/get-billboard";
import getProducts from "../../api-calls/get-products";
import ProductsList from "../../components/ProductsList/ProductsList";

const Homepage = ()=>{
    const [billboard, setBillboard] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchBillboard = async () => {
            try {
                const result = await getBillboard("e2df01b0-202c-4034-9b1e-f90d2855fd10");
                setBillboard(result);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const result = await getProducts({isFeatured: true});
                setProducts(result);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchBillboard();
        fetchProducts()
    }, []);

    return(
        <Container>
            <div className='space-y-10 pb-10'>
                <Billboard data={billboard}/>
                <div className='flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8'>
                    <ProductsList title="Wyróżnione produkty" items={products}/>
                </div>
            </div>
        </Container>
    );
}

export default Homepage