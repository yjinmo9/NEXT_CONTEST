import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageInput({ className }: { className: string }) {
    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [imageUrl, setImageUrl] = useState<string[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));

        try {
            const formData = new FormData();
            formData.append('file', selected);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                console.error('❌ Upload failed:', result.error || 'Unknown error');
                return;
            }

            console.log('✅ 업로드 성공! URL:', result.url);

            setImageUrl(result.url);

        } catch (error) {
            console.error('❌ 예외 발생:', error);
        }
    };

    return (
        <div className={className}>
            {preview ? (
                <div className="relative w-[362px] h-[365px] rounded-lg overflow-hidden border border-gray-300">
                    <Image
                        src={preview}
                        alt="미리보기"
                        width={362}
                        height={365}
                        className="object-cover w-full h-full"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setFile(null);
                            setPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-opacity-100 transition"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[362px] h-[365px] rounded-lg border border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100"
                >
                    <span className="text-2xl">＋</span>
                    <p className="text-[15px]">사진 업로드</p>
                </div>
            )}

            <input
                type="file"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <input type="hidden" name="media_urls" value={imageUrl} />
        </div>
    )
}