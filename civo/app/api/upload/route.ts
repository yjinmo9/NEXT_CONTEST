import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

function sanitizeFileName(fileName: string): string {
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  const baseName = fileName
    .substring(0, fileName.lastIndexOf('.'))
    .replace(/[^a-z0-9]/gi, '-') // 특수문자 제거
    .toLowerCase();

  return `${baseName}-${Date.now()}${extension}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('🚫 유효하지 않은 파일:', file);
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    const supabase = await createClient();
    const safeFileName = sanitizeFileName(file.name);

    const { data, error } = await supabase.storage
      .from('reports')
      .upload(safeFileName, file);

    if (error || !data) {
      console.error('❌ Supabase 업로드 오류:', error);
      return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('reports')
      .getPublicUrl(safeFileName);

    if (!urlData?.publicUrl) {
      console.error('❌ URL 생성 실패:', URIError);
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 });
    }

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error('🔥 서버 오류:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

