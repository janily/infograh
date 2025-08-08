"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

import { title } from "@/components/primitives";
import { redirectToCheckout } from "@/lib/stripe-client";
import { ErrorToast } from "@/components/error-toast";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (plan: 'STARTER' | 'CREATOR') => {
    try {
      setLoadingPlan(plan);
      setError(null);
      
      // Get price ID from environment variables (client-side)
      const priceId = plan === 'STARTER' 
        ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID;
      
      if (!priceId) {
        throw new Error('Stripe configuration is missing. Please contact support.');
      }
      
      await redirectToCheckout(priceId);
    } catch (error) {
      console.error('Error starting checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout. Please try again.';
      setError(errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="w-full min-h-screen snap-start flex items-center" id="pricing">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <motion.h2 className={title({ size: "md", fullWidth: true, className: "text-center" })} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Simple pricing
        </motion.h2>
        <motion.p className="text-default-600 mt-2 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Pay once. Keep everything you generate.
        </motion.p>
        <div className="grid gap-6 md:grid-cols-2 mt-6 max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="bg-content1/60 border border-default-100 max-w-sm mx-auto w-full">
              <CardHeader className="flex items-center justify-between">
                <div className="font-semibold">Starter</div>
                <div className="text-2xl font-semibold">$12</div>
              </CardHeader>
              <CardBody className="text-default-600">
                <ul className="list-disc ml-4 space-y-2">
                  <li>20 images</li>
                  <li>High consistency model</li>
                  <li>Commercial use</li>
                </ul>
                <Button 
                  color="primary" 
                  className="mt-6" 
                  radius="full" 
                  size="lg"
                  isLoading={loadingPlan === 'STARTER'}
                  onPress={() => handlePurchase('STARTER')}
                >
                  Choose Starter
                </Button>
              </CardBody>
            </Card>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="bg-content1/60 border-2 border-primary/40 max-w-sm mx-auto w-full">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  Creator
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-900 dark:text-primary-100">
                    Best value
                  </span>
                </div>
                <div className="text-2xl font-semibold">$20</div>
              </CardHeader>
              <CardBody className="text-default-600">
                <ul className="list-disc ml-4 space-y-2">
                  <li>40 images</li>
                  <li>Priority generation</li>
                  <li>HD exports</li>
                </ul>
                <Button 
                  color="primary" 
                  variant="shadow" 
                  className="mt-6" 
                  radius="full" 
                  size="lg"
                  isLoading={loadingPlan === 'CREATOR'}
                  onPress={() => handlePurchase('CREATOR')}
                >
                  Choose Creator
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {error && (
        <ErrorToast 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </section>
  );
}


