import type { Viewport } from 'next';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow container mx-auto px-6 py-16 max-w-4xl'>
        <Card className='bg-content1/60 border border-default-100'>
          <CardBody className='p-8'>
            <h1 className='text-4xl font-bold mb-6 text-foreground'>
              Privacy Policy for url2info
            </h1>

            <p className='mb-6 text-default-600 text-lg'>
              This Privacy Policy describes how url2info handles information when 
              you use our AI-powered infographic generation service.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              1. Information We Process
            </h2>
            <h3 className='text-lg font-semibold mb-3 text-foreground'>
              URL Content
            </h3>
            <p className='mb-4 text-default-600'>
              When you use url2info, we process:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>The URLs you provide for infographic generation</li>
              <li>The text content extracted from those URLs</li>
              <li>Generated infographic images</li>
            </ul>

            <h3 className='text-lg font-semibold mb-3 text-foreground'>
              Technical Information
            </h3>
            <p className='mb-6 text-default-600'>
              We may automatically collect basic technical information such as 
              browser type, device information, and usage patterns to improve 
              our service quality and user experience.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              2. How We Use Your Information
            </h2>
            <p className='mb-4 text-default-600'>We use the information to:</p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Fetch and process content from the URLs you provide</li>
              <li>Generate infographic images using AI technology</li>
              <li>Improve our service and AI generation quality</li>
              <li>Maintain and optimize our platform</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              3. Content Processing and Storage
            </h2>
            <p className='mb-4 text-default-600'>
              Your content is processed through our AI service provider{' '}
              <Link
                isExternal
                showAnchorIcon
                className='text-primary hover:text-primary/80'
                href='https://grsai.com'
              >
                Nano Banana Pro (GRSAI)
              </Link>
              . We ensure that:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>URL content is processed temporarily for infographic generation</li>
              <li>Generated images are available for approximately 2 hours after creation</li>
              <li>We do not permanently store the URLs or content you submit</li>
              <li>We do not use your content for marketing purposes</li>
            </ul>

            <p className='mb-6 text-default-600'>
              Note: Generated infographics are temporarily stored by our AI provider, 
              GRSAI, for operational purposes. We recommend downloading your infographics 
              promptly as they will expire.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              4. Third-Party Services
            </h2>
            <p className='mb-4 text-default-600'>
              We work with trusted third-party services:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>
                <strong>Unifuncs</strong> - Web content fetching and extraction
              </li>
              <li>
                <strong>GRSAI (Nano Banana Pro)</strong> - AI infographic generation
              </li>
              <li>
                <strong>Vercel</strong> - Hosting and infrastructure
              </li>
            </ul>
            <p className='mb-6 text-default-600'>
              We do not sell, rent, or share your information with third parties 
              for marketing purposes.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              5. Data Security
            </h2>
            <p className='mb-6 text-default-600'>
              We implement appropriate security measures to protect your information:
            </p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure API communications</li>
              <li>Regular security monitoring</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              6. Cookies and Tracking
            </h2>
            <p className='mb-6 text-default-600'>
              url2info may use essential cookies for basic functionality. We do not 
              use tracking cookies or third-party advertising trackers. Any analytics 
              we use is for improving our service quality.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              7. Your Rights
            </h2>
            <p className='mb-4 text-default-600'>You have the right to:</p>
            <ul className='list-disc pl-8 mb-6 text-default-600 space-y-2'>
              <li>Download your generated infographics before they expire</li>
              <li>Choose not to use the service</li>
              <li>Contact us with privacy-related questions</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              8. Children&apos;s Privacy
            </h2>
            <p className='mb-6 text-default-600'>
              url2info is not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              9. Changes to This Policy
            </h2>
            <p className='mb-6 text-default-600'>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4 text-foreground'>
              10. Contact Us
            </h2>
            <p className='mb-6 text-default-600'>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us through our website.
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

export default PrivacyPolicy;
