'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import TechStack from '@/components/TechStack';
import Team from '@/components/Team';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Problem />
        <About />
        <HowItWorks />
        <Benefits />
        <TechStack />
        <Team />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
