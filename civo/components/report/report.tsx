import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postAction } from "@/app/actions";

export default function ReportInput() {
    return(
        <>  <form>
                <Label htmlFor="title">Title</Label>
                <Input name="title" placeholder="title" required/>
                <Label htmlFor="content">Content</Label>
                <Input name="content" placeholder="contents" required/>
                <SubmitButton pendingText="Posting.." formAction={postAction}>
                    Post
                </SubmitButton>
            </form>
        </>
    )
}