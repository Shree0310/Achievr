import { Suspense } from 'react';
import Login from '../Components/Login/Login';

export default function AuthPage(){
    return (
        <Suspense>
            <Login/>
        </Suspense>
    );
}