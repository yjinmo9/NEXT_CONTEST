// ReportInput.tsx
"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TextareaAutosize from "react-textarea-autosize"
import { postAction } from "@/app/actions";
import { use, useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDamageForm } from "@/app/context/DamageFormContext";
import { useMissingForm } from "@/app/context/MissingFormContext";
import AutoLocationFetcher from "@/components/report/AutoLocationFetcher";
import { Coordinates } from '@/components/home/map';
import searchGlyphImg from '@/src/img/Search Glyph.png';
import MapWithMarker from "./MapwithMarker";
import LocateSelector from "./LocateSelector";

export function IncidentInput() {
    const categories = ['화재', '인구밀집', '교통사고', '기타'];
    const [selected, setSelected] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      
          // 🔸 이후 media_urls에 넣는 로직이 있다면 여기서 처리 가능
          // 예: setUploadedUrl(result.url);
      
        } catch (error) {
          console.error('❌ 예외 발생:', error);
        }
      };
      ;

    const [loc, setLoc] = useState<Coordinates>([127.02, 37.58]);
    const [userloc, setUserloc] = useState<Coordinates>([0, 0]);

    const handleLocationChange = ({ loc, locStr }: { loc: Coordinates, locStr: string }) => {
        setLoc(loc)
    }

    const initLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserloc([position.coords.longitude, position.coords.latitude]);
        });
    };

    useEffect(() => {
        initLocation();
    }, []);

    return (
        <form className="pb-[100px] flex-1 flex flex-col min-w-64 h-full pointer-events-auto" encType="multipart/form-data">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <input type="hidden" name="type" value="incident" />
                <div id="사고유형">
                    <Label htmlFor="category" className="font-semibold text-[15px]">사고 유형 <span className="text-red-700">*</span></Label>
                    <div className="mt-[12px] h-[30px] flex flex-wrap gap-2">
                        {categories.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelected(type)}
                                className={`px-4 py-1 text-sm border rounded-[10px] transition 
                        ${selected === type
                                        ? 'bg-black text-white border-black'
                                        : 'text-black border-black hover:bg-gray-100'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                {selected && (
                    <input type="hidden" name="category" value={selected} />
                )}
                <LocateSelector onLocateChange={handleLocationChange} />
                <div id="신고 제목">
                    <Label htmlFor="title" className="font-semibold text-[15px]">신고 제목 <span className="text-red-700">*</span></Label>
                    <Input name="title" placeholder="신고 제목을 입력해주세요" className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description" required />
                </div>
                <div id="사진/영상">
                    <Label htmlFor="file-upload" className="font-semibold text-[15px]">사진 · 영상 <span className="text-red-700">*</span></Label>
                    <p className="mt-[12px] text-description text-[15px]">사고를 파악할 수 있는 사진/영상을 업로드해 주세요.</p>
                    <div className="mt-[10px] flex gap-4">

                        {preview && (
                            <div className="w-[126px] h-[126px] rounded-lg overflow-hidden border border-gray-300">
                                <Image
                                    src={preview}
                                    alt="미리보기"
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-[126px] h-[126px] rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100"
                        >
                            <span className="text-2xl">＋</span>
                        </div>

                        <input
                            type="file"
                            name="image"
                            accept="image/*, video/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
                <div id="사고 내용" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">사고 내용</Label>
                    <TextareaAutosize className="mt-[12px] min-h-[176px] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description" name="content" placeholder="사고내용을 작성해주세요" required />
                </div>
                <input type="hidden" name="report_lat" value={typeof loc?.[1] === 'number' ? loc[1] : ''} />
                <input type="hidden" name="report_lng" value={typeof loc?.[0] === 'number' ? loc[0] : ''} />

                <input type="hidden" name="user_lat" value={typeof userloc?.[1] === 'number' ? userloc[1] : ''} />
                <input type="hidden" name="user_lng" value={typeof userloc?.[0] === 'number' ? userloc[0] : ''} />

                <SubmitButton pendingText="Posting.." formAction={postAction} className="h-[53px]">
                    신고하기
                </SubmitButton>
            </div>
        </form>
    )
}


export function MissingInput1() {
    const router = useRouter();
    const { data, setData } = useMissingForm();

    const isValid =
        data.name.trim() !== "" &&
        data.content.trim() !== "" &&
        data.gender.trim() !== "" &&
        data.age !== 0;

    return (
        <form className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto" encType="multipart/form-data">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <input type="hidden" name="type" value="missing" />
                <div id="이름">
                    <Label htmlFor="name" className="font-semibold text-[15px]">
                        실종자 이름 <span className="text-red-700">*</span>
                    </Label>
                    <Input
                        name="name"
                        placeholder="실종자의 이름을 입력해주세요"
                        className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description"
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                    />
                </div>
                <div id="나이 성별" className="flex flex-col">
                    <Label htmlFor="age-gender" className="font-semibold text-[15px]">
                        나이 / 성별 <span className="text-red-700">*</span>
                    </Label>
                    <p className="text-[14px] text-description mt-[10px]">
                        실종자는 현재{" "}
                        <select
                            value={data.age === 0 ? "나이" : data.age}
                            onChange={(e) =>
                                setData({ ...data, age: parseInt(e.target.value) || 0 })
                            }
                            className="border-b border-black appearance-none focus:outline-none px-1 bg-transparent text-black font-semibold"
                        >
                            <option disabled>나이</option>
                            <option value={10}>10대</option>
                            <option value={20}>20대</option>
                            <option value={30}>30대</option>
                            <option value={40}>40대</option>
                            <option value={50}>50대</option>
                            <option value={60}>60대 이상</option>
                        </select>{" "}
                        <select
                            value={data.gender || "성별"}
                            onChange={(e) => setData({ ...data, gender: e.target.value })}
                            className="border-b border-black appearance-none focus:outline-none px-1 bg-transparent text-black font-semibold"
                        >
                            <option disabled>성별</option>
                            <option value="남성">남성</option>
                            <option value="여성">여성</option>
                        </select>{" "}
                        입니다.
                    </p>
                </div>
                <div id="실종 상황" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">
                        실종 당시 상황 <span className="text-red-700">*</span>
                    </Label>
                    <TextareaAutosize
                        className="mt-[12px] min-h-[calc(100vh-600px)] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description"
                        name="content"
                        placeholder="실종 당시 상황을 자세하게 입력해주세요"
                        onChange={(e) => setData({ ...data, content: e.target.value })}
                        required
                    />
                </div>
                <button
                    type="button"
                    disabled={!isValid}
                    onClick={() => router.push("/report/missing/2")}
                    className={`h-[53px] rounded-[10px] w-full text-sm font-semibold transition ${isValid
                        ? "bg-black text-white"
                        : "bg-gray-300 text-black cursor-not-allowed"
                        }`}
                >
                    다음
                </button>
            </div>
        </form>
    );
}

export function MissingInput2() {
    const { data } = useMissingForm()
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      
          // 🔸 이후 media_urls에 넣는 로직이 있다면 여기서 처리 가능
          // 예: setUploadedUrl(result.url);
      
        } catch (error) {
          console.error('❌ 예외 발생:', error);
        }
      };
      

    return (
        <form encType="multipart/form-data" className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <input type="hidden" name="type" value="missing" />
                <input type="hidden" name="title" value={data.name} />
                <input type="hidden" name="content" value={data.content} />
                <input type="hidden" name="missing_name" value={data.name} />
                <input type="hidden" name="missing_age" value={data.age.toString()} /> {/* 숫자를 문자열로 변환 */}
                <input type="hidden" name="missing_gender" value={data.gender} />

                <div id="사진">
                    <Label htmlFor="file-upload" className="font-semibold text-[15px]">사진 <span className="text-red-700">*</span></Label>
                    <p className="mt-[12px] text-description text-[15px]">실종자의 생김새나 인상착의를 파악할 수 있는 사진을 업로드해 주세요.</p>
                    <div className="mt-[10px] flex flex-col gap-4 items-center">
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
                            required
                        />
                    </div>
                </div>

                <SubmitButton
                    formAction={postAction}
                    pendingText="제출 중..."
                    className="h-[53px] bg-black text-white rounded-[10px]"
                >
                    신고하기
                </SubmitButton>
            </div>
        </form>
    )
}

export function DamageInput1() {
    const router = useRouter();
    const { data, setData } = useDamageForm();
    const isValid = data.title.trim() !== '' && data.content.trim() !== '';
    const [locStr, setLocStr] = useState<string | null>('');
    const [loc, setLoc] = useState<Coordinates | null>(null);

    const handleLocationChange = ({ loc, locStr }: { loc: Coordinates, locStr: string }) => {
        setLocStr(locStr)
        setLoc(loc)
    }
    return (
        <form className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto" encType="multipart/form-data">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <div id="파손신고 제목">
                    <Label htmlFor="title" className="font-semibold text-[15px]">파손신고 제목 <span className="text-red-700">*</span></Label>
                    <Input name="title" placeholder="파손신고 제목을 입력해주세요" className="mt-[12px] h-[52px] border rounded-[10px] border-formborder placeholder-description" onChange={(e) => setData({ title: e.target.value })} required />
                </div>
                <LocateSelector onLocateChange={handleLocationChange} />
                <div id="파손 내용" className="flex flex-col">
                    <Label htmlFor="content" className="font-semibold text-[15px]">파손 내용 <span className="text-red-700">*</span></Label>
                    <TextareaAutosize className="mt-[12px] min-h-[calc(100vh-600px)] py-[10px] px-[15px] border rounded-[10px] border-formborder placeholder-description" name="content" placeholder="파손 내용을 작성해주세요" onChange={(e) => setData({ content: e.target.value })} required />
                </div>
                <input type="hidden" name="report_lat">{loc?.[1]}</input>
                <input type="hidden" name="report_lng">{loc?.[0]}</input>
                <button
                    type="button"
                    disabled={!isValid}
                    onClick={() => router.push('/report/damage/2')}
                    className={`h-[53px] rounded-[10px] w-full text-sm transition ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-black font-semibold cursor-not-allowed'
                        }`}
                >
                    다음
                </button>
            </div>
        </form>
    )
}

export function DamageInput2() {
    const { data } = useDamageForm()
    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      
          // 🔸 이후 media_urls에 넣는 로직이 있다면 여기서 처리 가능
          // 예: setUploadedUrl(result.url);
      
        } catch (error) {
          console.error('❌ 예외 발생:', error);
        }
      };
      

    const [userloc, setUserloc] = useState<Coordinates | null>([0, 0]);

    const initLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserloc([position.coords.longitude, position.coords.latitude]);
        });
    };

    useEffect(() => {
        initLocation();
    }, []);

    return (
        <form encType="multipart/form-data" className="flex-1 flex flex-col min-w-64 h-full pointer-events-auto">
            <div className="mt-[5px] flex-grow overflow-y-auto min-h-0 flex flex-col gap-[32px]">
                <div id="사진/영상">
                    <Label htmlFor="file-upload" className="font-semibold text-[15px]">사진 <span className="text-red-700">*</span></Label>
                    <p className="mt-[12px] text-description text-[15px]">기물파손 상태를 파악할 수 있는 사진을 업로드해 주세요.</p>
                    <div className="mt-[10px] flex flex-col gap-4 items-center">
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
                    </div>
                </div>

                <input type="hidden" name="title" value={data.title} />
                <input type="hidden" name="content" value={data.content} />
                <input type="hidden" name="user_lat" value={userloc?.[1]} />
                <input type="hidden" name="user_lng" value={userloc?.[0]} />
                <SubmitButton formAction={postAction} pendingText="제출 중..." className="h-[53px] bg-black text-white rounded-[10px]">
                    신고하기
                </SubmitButton>
            </div>
        </form>
    )
}