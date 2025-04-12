"use client"

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  TextareaAutosize  from "react-textarea-autosize"
import { postAction } from "@/app/actions";

export default function ReportInput() {
    return(
        <>  <form className="flex-1 flex flex-col min-w-64">
                <h2 className="font-medium text-xl mb-4">Report</h2>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="title">Title</Label>
                    <Input name="title" placeholder="title" required/>
                    <Label htmlFor="content">Content</Label>
                    <TextareaAutosize className="border border-black-300 rounded-md px-4 py-2"name="content" placeholder="contents" required/>
                    <SubmitButton pendingText="Posting.." formAction={postAction}>
                        report this
                    </SubmitButton>
                </div>
            </form>
        </>
    )
}