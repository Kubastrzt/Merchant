import React, {useEffect, useState} from 'react';
import Heading from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Trash} from 'lucide-react';
import {Separator} from "@/components/ui/separator";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {useParams, useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {Modal} from "@/components/ui/modal";
import {useAuth} from "@clerk/clerk-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1),
    bannerId: z.string().min(1),
})

const CategoryForm = ({banners, initialData})=>{
    const {userId} = useAuth();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        form.reset(initialData || {
            name: '',
            bannerId: '',
        });
    }, [initialData]);


    const title = initialData ? "Edytuj kategorie" : "Stwórz kategorie";
    const description = initialData ? "Edit bieżącą kategorie" : "Dodaj nową kategorie";
    const action = initialData ? "Zapisz zmiany" : "Stwórz";

    const onDelete = async ()=>{
        try {
            setLoading(true)
            await toast.promise(axios.delete(`http://localhost:3001/api/${params.sid}/${userId}/categories/${params.cid}`),{
                pending: 'Usuwanie...',
                success: 'Kategoria została usunięta 👌',
                error: 'Coś poszło nie tak.. 🤯'
            })
            navigate(`/categories/${params.sid}/`);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    const onSubmit = async (data) =>{
        try {
            setLoading(true)
            if(initialData) {
                await toast.promise(axios.patch(`http://localhost:3001/api/${params.sid}/${userId}/categories/${params.cid}`, data),{
                    pending: 'Aktualizowanie...',
                    success: 'Kategoria została zaktualizowana 👌',
                    error: 'Coś poszło nie tak.. 🤯'
                })
            } else {
                await toast.promise(axios.post(`http://localhost:3001/api/${params.sid}/${userId}/categories`, data),{
                    pending: 'Tworzenie...',
                    success: 'Kategoria została stworzona 👌',
                    error: 'Coś poszło nie tak.. 🤯'
                })
            }
            navigate(`/categories/${params.sid}/`);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return(
        <>
            <ToastContainer/>
            <Modal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading}/>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description}/>
                {initialData && <Button disabled={loading} variant='destructive' size='sm' onClick={() => {
                    setOpen(true)
                }}>
                    <Trash className='h-4 w-4'/>
                </Button>}
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nazwa kategorii" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bannerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Baner</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder='Wybierz baner' className='bg-gray-700'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {banners?.map(banner=>(
                                                <SelectItem key={banner.id} value={banner.id}>
                                                    {banner.label}
                                                </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator/>
        </>
    );
}

export default CategoryForm