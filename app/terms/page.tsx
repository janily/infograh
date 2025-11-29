import type { Viewport } from 'next';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const TermsAndConditions: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow container mx-auto px-6 py-16 max-w-4xl'>
        <Card className='bg-content1/60 border border-default-100'>
          <CardBody className='p-8'>
            <h1 className='text-4xl font-bold mb-6 text-foreground'>
              Terms and Conditions for url2info
            </h1>

            <p className='mb-6 text-default-600 text-lg'>
              By using url2info, you agree to comply with and be bound by the
              following terms and conditions. Please read these terms carefully
              before using our platform.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              1. Acceptance of Terms
            </h2>
            <p className='mb-6 text-default-600'>
              By accessing or using url2info, you agree to be bound by these
              Terms and Conditions and all applicable laws and regulations. If
              you do not agree with any part of these terms, you may not use our
              services.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              2. Service Description
            </h2>
            <p className='mb-6 text-default-600'>
              url2info is an AI-powered service that transforms web articles and
              content into visual infographics. Our service fetches content from
              URLs you provide and uses{' '}
              <Link
                isExternal
                showAnchorIcon
                className='text-primary hover:text-primary/80'
                href='https://grsai.com'
              >
                Nano Banana Pro
              </Link>{' '}
              AI technology to generate infographic images. By using our
              service, you also agree to their respective terms of service.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              3. User Responsibilities
            </h2>
            <p className='mb-4 text-default-600'>
              When using url2info, you agree to:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>
                Only provide URLs to content that you have the right to use or
                is publicly accessible
              </li>
              <li>
                Not use the service to process content that is illegal,
                inappropriate, or violates others&apos; rights
              </li>
              <li>
                Not attempt to circumvent any technical limitations or security
                measures
              </li>
              <li>
                Not use the service for any illegal or unauthorized purpose
              </li>
              <li>
                Respect the intellectual property rights of original content
                creators
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              4. Content Guidelines
            </h2>
            <p className='mb-4 text-default-600'>
              Users must ensure that the URLs provided lead to content that:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Is not pornographic or sexually explicit</li>
              <li>Does not promote violence or hate speech</li>
              <li>Does not infringe on any intellectual property rights</li>
              <li>Is publicly accessible or you have permission to use</li>
              <li>Complies with applicable laws and regulations</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              5. Generated Infographics
            </h2>
            <p className='mb-6 text-default-600'>
              By using our AI infographic generation tools, you acknowledge
              that:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>
                Generated infographics are created based on the content from the
                URLs you provide
              </li>
              <li>
                You may use generated infographics for personal and commercial
                purposes
              </li>
              <li>
                We do not guarantee the accuracy or completeness of the
                generated content
              </li>
              <li>
                Generated images are available for download for a limited time
                (approximately 2 hours)
              </li>
              <li>You should download images promptly as they may expire</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              6. Service Availability
            </h2>
            <p className='mb-6 text-default-600'>
              url2info is currently provided free of charge during our beta
              period. We reserve the right to modify, suspend, or discontinue
              the service at any time without prior notice. We may introduce
              paid features or usage limits in the future.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              7. Limitation of Liability
            </h2>
            <p className='mb-6 text-default-600'>
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use url2info. The platform is provided on an
              &quot;as-is&quot; basis, and we make no warranties regarding its
              performance, accuracy, or results.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              8. Intellectual Property
            </h2>
            <p className='mb-6 text-default-600'>
              The url2info service, including its design, features, and
              underlying technology, is protected by intellectual property
              rights. You may not copy, modify, or distribute any part of the
              service without our permission. The original content from URLs
              remains the property of their respective owners.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              9. Changes to Terms
            </h2>
            <p className='mb-6 text-default-600'>
              We reserve the right to modify these terms at any time. Your
              continued use of url2info after changes are posted constitutes
              your acceptance of the modified terms.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              10. Governing Law
            </h2>
            <p className='mb-6 text-default-600'>
              These Terms and Conditions shall be governed by and construed in
              accordance with applicable laws, without regard to conflict of law
              provisions.
            </p>

            <p className='mt-8 text-sm text-default-500 border-t border-default-200 pt-6'>
              Last updated: November 2025
            </p>
          </CardBody>
        </Card>
      </main>
    </div>
  );
};

export default TermsAndConditions;
