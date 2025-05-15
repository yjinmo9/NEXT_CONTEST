import { Suspense } from "react";
import Signup from "./signup";

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>불러오는중...</div>}>
            <Signup />
        </Suspense>
    )
}