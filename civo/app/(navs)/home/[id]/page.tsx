// app/(navs)/home/[id]/page.tsx
import ClientReportDetail from './ClientReportDetail';

export default function ReportPage({ params }: { params: { id: string } }) {
  return <ClientReportDetail id={params.id} />;
}
