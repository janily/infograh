'use client';

import { GeneratingState } from '@/components/dashboard/generating/GeneratingState';
import { useRouter } from 'next/navigation';

export default function GeneratingDemoPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <GeneratingState onCancel={() => router.push('/')} />
    </div>
  );
}
