import React, {useEffect} from 'react';
import axios from "axios";
import Button from "../ui/button";
import Currency from "../Currency/Currency";
import useCart from "../../hooks/use-cart";
import {useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";

const Summary = ()=>{
    const [searchParams] = useSearchParams()
    const items = useCart((state)=>state.items);
    const removeAll = useCart((state)=>state.removeAll);
    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price)
    }, 0)

    useEffect(() => {
        if(searchParams.get("success")) {
            toast.success("Ukończono")
            removeAll();
        }

        if(searchParams.get("canceled")) {
            toast.error("Coś poszło nie tak!")
        }
    }, [searchParams, removeAll]);

    const onCheckout = async ()=>{
        const response = await axios.post(`${process.env.REACT_APP_PUBLIC_API_URL}/checkout`, {productIds: items.map(item=>item.id)})

        window.location = response.data.url
    }

    return(
        <div className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>
                Podsumowanie
            </h2>
            <div className='mt-6 space-y-4'>
                <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <div className='text-base font-medium text-gray-900'>
                        Cena
                    </div>
                    <Currency value={totalPrice}/>
                </div>
            </div>
            <Button className='w-full mt-6' onClick={onCheckout}>
                Do kasy
            </Button>
        </div>
    );
}

export default Summary