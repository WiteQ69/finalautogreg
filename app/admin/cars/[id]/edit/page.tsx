import EditCarClient from './EditCarClient';

export default function Page({ params }: { params: { id: string } }) {
  return <EditCarClient id={params.id} />;
}
