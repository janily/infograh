/**
 * Example component demonstrating usage of the theme configuration
 * This file shows best practices for using the design system
 */

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';

// This component demonstrates various theme patterns extracted from the codebase

export function ThemeExample() {
  return (
    <div className='container mx-auto max-w-7xl px-6 py-14'>
      {/* Section Title using typography system */}
      <h2 className='text-4xl font-black tracking-tighter text-center mb-8'>
        Theme Configuration Examples
      </h2>
      <p className='text-base text-default-500 text-center mb-12'>
        Demonstrating consistent visual styles from theme.config.ts
      </p>

      {/* Grid of examples */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Example 1: Standard Card Pattern */}
        <Card className='bg-content1/60 border border-default-100 h-full p-6'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-primary rounded-full' />
              <h3 className='text-xl font-semibold'>Standard Card</h3>
            </div>
          </CardHeader>
          <CardBody className='pt-0'>
            <p className='text-default-600 mb-4'>
              Uses standard card styling with semi-transparent background and
              subtle border.
            </p>
            <div className='flex gap-2'>
              <div className='px-3 py-1 bg-default-100 rounded-full text-xs font-medium'>
                Badge
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Example 2: Interactive Card with Hover */}
        <Card className='bg-content1/60 border border-default-100 hover:border-primary/30 transition-colors h-full p-6'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-success rounded-full' />
              <h3 className='text-xl font-semibold'>Interactive Card</h3>
            </div>
          </CardHeader>
          <CardBody className='pt-0'>
            <p className='text-default-600 mb-4'>
              Hover over this card to see the border color transition effect.
            </p>
            <Button className='w-full' color='primary' size='lg' variant='flat'>
              Action Button
            </Button>
          </CardBody>
        </Card>

        {/* Example 3: Gradient Background */}
        <Card className='bg-content1/60 border-2 border-primary/40 h-full p-6 relative overflow-visible'>
          <div className='absolute -top-3 -right-3 transform rotate-12'>
            <div className='bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 text-sm font-bold shadow-xl rounded-sm'>
              Featured
            </div>
          </div>
          <CardHeader className='pb-4 pt-6'>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-secondary rounded-full' />
              <h3 className='text-xl font-semibold'>Featured Card</h3>
            </div>
          </CardHeader>
          <CardBody className='pt-0'>
            <p className='text-default-600 mb-4'>
              Card with gradient badge and emphasized border.
            </p>
            <Button
              className='w-full'
              color='primary'
              size='lg'
              variant='shadow'
            >
              Get Started
            </Button>
          </CardBody>
        </Card>

        {/* Example 4: Color Indicators */}
        <Card className='bg-content1/60 border border-default-100 h-full p-6'>
          <CardHeader className='pb-4'>
            <h3 className='text-xl font-semibold'>Color Indicators</h3>
          </CardHeader>
          <CardBody className='pt-0 space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-primary rounded-full' />
              <span className='text-sm'>Primary - Brand color</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-secondary rounded-full' />
              <span className='text-sm'>Secondary - Accent</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-success rounded-full' />
              <span className='text-sm'>Success - Positive</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-warning rounded-full' />
              <span className='text-sm'>Warning - Caution</span>
            </div>
          </CardBody>
        </Card>

        {/* Example 5: Typography Hierarchy */}
        <Card className='bg-content1/60 border border-default-100 h-full p-6'>
          <CardHeader className='pb-4'>
            <h3 className='text-xl font-semibold'>Typography Scale</h3>
          </CardHeader>
          <CardBody className='pt-0 space-y-2'>
            <p className='text-xs text-default-500'>Extra small text (xs)</p>
            <p className='text-sm text-default-600'>Small text (sm)</p>
            <p className='text-base text-foreground'>Base text (base)</p>
            <p className='text-lg font-medium'>Large text (lg)</p>
            <p className='text-xl font-semibold'>Extra large (xl)</p>
            <p className='text-2xl font-bold text-primary'>2XL Bold</p>
          </CardBody>
        </Card>

        {/* Example 6: Button Variants */}
        <Card className='bg-content1/60 border border-default-100 h-full p-6'>
          <CardHeader className='pb-4'>
            <h3 className='text-xl font-semibold'>Button Styles</h3>
          </CardHeader>
          <CardBody className='pt-0 space-y-3'>
            <Button className='w-full' color='primary' size='lg'>
              Primary Button
            </Button>
            <Button
              className='w-full bg-success text-white'
              size='lg'
              variant='solid'
            >
              Success CTA
            </Button>
            <Button className='w-full' color='primary' size='lg' variant='flat'>
              Secondary
            </Button>
            <Button
              className='w-full'
              color='primary'
              size='lg'
              variant='bordered'
            >
              Outlined
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Spacing Examples */}
      <div className='mt-12'>
        <h3 className='text-2xl font-bold mb-6'>Spacing System</h3>
        <div className='bg-content1/60 border border-default-100 rounded-xl p-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-primary' />
              <span className='text-sm'>gap-2 (8px)</span>
            </div>
            <div className='flex items-center gap-4'>
              <div className='w-3 h-3 bg-secondary' />
              <span className='text-sm'>gap-4 (16px)</span>
            </div>
            <div className='flex items-center gap-6'>
              <div className='w-4 h-4 bg-success' />
              <span className='text-sm'>gap-6 (24px)</span>
            </div>
            <div className='flex items-center gap-8'>
              <div className='w-6 h-6 bg-warning' />
              <span className='text-sm'>gap-8 (32px)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Border Radius Examples */}
      <div className='mt-12'>
        <h3 className='text-2xl font-bold mb-6'>Border Radius Scale</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-6 text-center'>
            <div className='text-sm font-medium mb-2'>rounded-lg</div>
            <div className='text-xs text-default-500'>12px</div>
          </div>
          <div className='bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6 text-center'>
            <div className='text-sm font-medium mb-2'>rounded-xl</div>
            <div className='text-xs text-default-500'>16px</div>
          </div>
          <div className='bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 text-center'>
            <div className='text-sm font-medium mb-2'>rounded-2xl</div>
            <div className='text-xs text-default-500'>24px</div>
          </div>
          <div className='bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-6 text-center'>
            <div className='text-sm font-medium mb-2'>rounded-3xl</div>
            <div className='text-xs text-default-500'>32px</div>
          </div>
        </div>
      </div>

      {/* Shadow Examples */}
      <div className='mt-12'>
        <h3 className='text-2xl font-bold mb-6'>Shadow Scale</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-content1 rounded-xl shadow-lg p-6'>
            <div className='text-sm font-medium mb-2'>shadow-lg</div>
            <p className='text-xs text-default-500'>Standard elevation</p>
          </div>
          <div className='bg-content1 rounded-xl shadow-xl p-6'>
            <div className='text-sm font-medium mb-2'>shadow-xl</div>
            <p className='text-xs text-default-500'>Emphasized elevation</p>
          </div>
          <div className='bg-content1 rounded-xl shadow-2xl p-6'>
            <div className='text-sm font-medium mb-2'>shadow-2xl</div>
            <p className='text-xs text-default-500'>Maximum elevation</p>
          </div>
        </div>
      </div>

      {/* Opacity Examples */}
      <div className='mt-12'>
        <h3 className='text-2xl font-bold mb-6'>Opacity Levels</h3>
        <div className='bg-content1 rounded-xl border border-default-100 p-6'>
          <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
            <div className='text-center'>
              <div className='bg-primary/5 rounded-lg p-4 mb-2'>
                <div className='text-xs font-medium'>/5</div>
              </div>
              <div className='text-xs text-default-500'>5%</div>
            </div>
            <div className='text-center'>
              <div className='bg-primary/10 rounded-lg p-4 mb-2'>
                <div className='text-xs font-medium'>/10</div>
              </div>
              <div className='text-xs text-default-500'>10%</div>
            </div>
            <div className='text-center'>
              <div className='bg-primary/20 rounded-lg p-4 mb-2'>
                <div className='text-xs font-medium'>/20</div>
              </div>
              <div className='text-xs text-default-500'>20%</div>
            </div>
            <div className='text-center'>
              <div className='bg-primary/30 rounded-lg p-4 mb-2'>
                <div className='text-xs font-medium'>/30</div>
              </div>
              <div className='text-xs text-default-500'>30%</div>
            </div>
            <div className='text-center'>
              <div className='bg-primary/40 rounded-lg p-4 mb-2'>
                <div className='text-xs font-medium'>/40</div>
              </div>
              <div className='text-xs text-default-500'>40%</div>
            </div>
            <div className='text-center'>
              <div className='bg-primary/60 rounded-lg p-4 mb-2'>
                <div className='text-xs font-medium'>/60</div>
              </div>
              <div className='text-xs text-default-500'>60%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
