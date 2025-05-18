// app/(auth)/sign-in/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useMemo } from "react";
import Image from 'next/image';

export default function Login() {
  const searchParams = useSearchParams();

  const message = useMemo(() => {
    const type = searchParams.get("type");
    const msg = searchParams.get("message");
    if (!type || !msg) return null;
    return { type, message: msg };
  }, [searchParams]);

  return (
    <form className="flex flex-col gap-4 w-full max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold">로그인</h1>

      {message && <FormMessage message={message} />}

      <div className="flex flex-col gap-2 mt-4">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" type="email" required />

        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요"
          required
        />

        <SubmitButton formAction={signInAction} pendingText="로그인 중...">
          로그인
        </SubmitButton>
      </div>
      <a
        href="/api/auth/kakao/login"
        className="flex items-center justify-center gap-2
             bg-[#FEE500] hover:bg-[#ffd400] text-[#381C1C]
             font-semibold py-2 rounded-md"
      >
        <Image src="/img/kakao_login_medium_narrow.png" alt="" width={20} height={20} />
        카카오로 로그인
      </a>

      <p className="text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <Link href="/sign-up" className="text-primary underline font-medium">
          회원가입
        </Link>
      </p>
    </form>
  );
}
