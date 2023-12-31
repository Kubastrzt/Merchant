import React from 'react';
import {useParams} from "react-router-dom";
import {useOrigin} from "../../hooks/useOrigin";
import {useAuth} from "@clerk/clerk-react";
import ApiPopup from "../ui/api-popup";

const ApiList = ({entityName, entityIdName})=>{
    const params = useParams();
    const origin = useOrigin();
    const {userId} = useAuth();

    const baseUrl = `${origin}/api`;

    return(
        <>
            <ApiPopup title="GET" variant='public' description={`${baseUrl}/${params.sid}/${entityName}`}/>
            <ApiPopup title="GET" variant='public' description={`${baseUrl}/${params.sid}/${entityName}/{${entityIdName}}`}/>
            <ApiPopup title="POST" variant='admin' description={`${baseUrl}/${params.sid}/${userId}/${entityName}`}/>
            <ApiPopup title="PATCH" variant='admin' description={`${baseUrl}/${params.sid}/${userId}/${entityName}/{${entityIdName}}`}/>
            <ApiPopup title="DELETE" variant='admin' description={`${baseUrl}/${params.sid}/${userId}/${entityName}/{${entityIdName}}`}/>
        </>
    );
}

export default ApiList