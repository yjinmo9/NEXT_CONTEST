import { Suspense } from "react";
import Login from "./Login";

export default function signin() {
    return (
        <Suspense fallback={<div>불러오는중...</div>}>
            <Login />  
        </Suspense>
    )
}