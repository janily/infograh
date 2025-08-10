'use client';

import React, { useState } from 'react';
import { Alert } from '@heroui/alert';

export function RetentionNotice() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className='mb-4'>
      <div className='relative'>
        <Alert
          hideIconWrapper
          color='default'
          description={
            <>
              Please save your images as soon as possible. Images migth be
              removed from your account after 48 hours.{' '}
            </>
          }
          title=''
          variant='bordered'
        />
        <button
          aria-label='Dismiss notice'
          className='absolute right-2 top-2 rounded-md px-2 py-1 text-warning-800 hover:bg-warning-100'
          type='button'
          onClick={() => setHidden(true)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
