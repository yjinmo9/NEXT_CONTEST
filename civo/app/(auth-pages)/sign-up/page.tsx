'use client';

import { useSearchParams } from "next/navigation";
import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/form-message";
import { SmtpMessage } from "../smtp-message";
import { useMemo } from "react";

export default function Signup() {
  const searchParams = useSearchParams();

  const message = useMemo(() => {
    const type = searchParams.get("type");
    const msg = searchParams.get("message");
    if (!type || !msg) return null;
    return { type, message: msg };
  }, [searchParams]);

  return (
    <>
      <form className="flex flex-col w-full px-[20px] mt-[70px] gap-[24px]">
        <h1 className="text-2xl font-medium">CIVO에 오신걸 환영합니다.</h1>
        <p className="text-sm text-foreground">서비스 이용을 위해 회원가입 해주세요.</p>

        <div className="flex flex-col gap-2 [&>input]:mb-3">
          <Label>Email</Label>
          <Input name="email" placeholder="Example@email.com" required />

          <Label>비밀번호</Label>
          <Input type="password" name="password" placeholder="문자, 숫자, 특수문자 포함 8~20자" minLength={8} required />

          <Label>비밀번호 확인</Label>
          <Input type="password" name="confirmPassword" placeholder="비밀번호 재입력" required />

          <Label>이름</Label>
          <Input name="name" placeholder="이름을 입력해주세요" required />

          <Label>전화번호</Label>
          <Input name="phone" placeholder="전화번호를 입력해주세요" required />

          <SubmitButton formAction={signUpAction} pendingText="회원가입 중...">
            회원가입
          </SubmitButton>

          <FormMessage message={message} />
        </div>
      </form>

      <SmtpMessage />
    </>
  );
}
