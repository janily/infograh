'use client';

import { useRouter } from 'next/navigation';

import { GeneratingState } from '@/components/dashboard/generating/GeneratingState';

export default function GeneratingDemoPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <GeneratingState onCancel={() => router.push('/')} />
    </div>
  );
}
