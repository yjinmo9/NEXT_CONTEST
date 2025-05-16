import Image from "next/image";
import Link from "next/link";

export function ProfileSection({ name, profile }: { name?: string, profile?: string }) {
  const isLoading = !name || !profile;

  if (isLoading) {
    return (
      <div className="px-[20px] py-[16px]">
        <h1 className="text-[15px] font-semibold mb-[12px]">내 정보</h1>
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="px-[20px] py-[16px]">
      <h1 className="text-[15px] font-semibold mb-[12px]">내 정보</h1>
      <div className="flex items-center gap-[10px]">
        <div className="relative w-[50px] h-[50px]">
          <Image
            src={profile || "/img/profile.png"}
            alt="프로필"
            width={50}
            height={50}
            className="aspect-square rounded-full"
          />
        </div>
        <div>
          <p className="text-[15px] font-medium">{name}</p>
          <Link href="/my/profileEdit" className="text-[13px] text-gray-500 mt-[2px]">
            프로필 수정하기
          </Link>
        </div>
      </div>
    </div>
  );
}
