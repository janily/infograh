'use client';

import { motion, Variants } from 'framer-motion';

import { title } from '@/components/primitives';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: 'Paste URL',
      description:
        'Simply paste your article link - WeChat articles, blogs, or news. We handle the rest automatically.',
      icon: '🔗',
    },
    {
      step: 2,
      title: 'AI Analysis',
      description:
        'Nano Banana Pro reads and extracts key insights, data points, and creates a visual structure.',
      icon: '🤖',
    },
    {
      step: 3,
      title: 'Download Infographic',
      description:
        'Get a beautiful, shareable infographic in seconds. Clean design, professional quality.',
      icon: '📊',
    },
  ];

  return (
    <section
      className='w-full py-20'
      id='how-it-works'
    >
      <div className='container mx-auto max-w-5xl px-6'>
        <motion.h2
          className={title({
            size: 'md',
            fullWidth: true,
            className: 'text-center mb-4',
          })}
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          How it works
        </motion.h2>
        <motion.p
          className='text-center text-default-600 text-lg mb-12'
          initial='hidden'
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView='visible'
        >
          Transform articles into infographics in three simple steps
        </motion.p>

        {/* Steps section */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          initial='hidden'
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView='visible'
        >
          {steps.map((step) => (
            <motion.div 
              key={step.step} 
              className='flex flex-col items-center text-center'
              variants={fadeUp}
            >
              {/* Step number */}
              <div className='w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-bold text-xl shadow-lg mb-5'>
                {step.step}
              </div>
              
              {/* Icon and title */}
              <div className='flex items-center justify-center gap-2 mb-3'>
                <span className='text-2xl'>{step.icon}</span>
                <h3 className='text-xl font-semibold'>{step.title}</h3>
              </div>
              
              {/* Description */}
              <p className='text-default-500 text-sm leading-relaxed max-w-xs'>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
