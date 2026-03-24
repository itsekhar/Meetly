import MeetingRoom from '@/components/MeetingRoom';
import ProtectedRoute from '@/components/ProtectedRoute';

interface MeetingPageProps {
  params: {
    roomID: string;
  };
}

export default function MeetingPage({ params }: MeetingPageProps) {
  return (
    <ProtectedRoute>
      <MeetingRoom />
    </ProtectedRoute>
  );
}
