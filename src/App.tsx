/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Scale, 
  Wind, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  ShoppingBag, 
  FileText, 
  ShieldCheck, 
  Moon, 
  Sun,
  Loader2,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Palette,
  Palette as PaletteIcon,
  Shirt,
  Grid,
} from 'lucide-react';
import { analyzeFabric, FabricSpecs, TextileAnalysis } from './services/geminiService';

import ReactMarkdown from 'react-markdown';

const VIZ_OPTIONS = [
  { 
    id: 'drape', 
    title: '3D Drape Simulation', 
    desc: 'Simulate fabric movement on a virtual model.', 
    icon: <Shirt className="w-5 h-5" />,
    value: '3D Drape Simulation'
  },
  { 
    id: 'pattern', 
    title: 'AI Pattern Generator', 
    desc: 'Create seamless repeating patterns.', 
    icon: <Grid className="w-5 h-5" />,
    value: 'AI Pattern Generator'
  },
  { 
    id: 'palette', 
    title: 'Seasonal Palette', 
    desc: 'Suggest Pantone-matched shades for trends.', 
    icon: <PaletteIcon className="w-5 h-5" />,
    value: 'Seasonal Palette'
  },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState<'home' | 'loading' | 'results' | 'clarify'>('home');
  const [specs, setSpecs] = useState<FabricSpecs>({
    fiberType: '',
    gsm: '',
    weave: '',
    finish: '',
    useCase: '',
    vizOption: ''
  });
  const [analysis, setAnalysis] = useState<TextileAnalysis | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    try {
      const result = await analyzeFabric(specs);
      setAnalysis(result);
      if (result.isClarificationNeeded) {
        setStep('clarify');
      } else {
        setStep('results');
      }
    } catch (error) {
      console.error(error);
      setStep('home');
    }
  };

  const reset = () => {
    setSpecs({
      fiberType: '',
      gsm: '',
      weave: '',
      finish: '',
      useCase: '',
      vizOption: ''
    });
    setAnalysis(null);
    setStep('home');
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 transition-colors duration-300">
      {/* Header */}
      <header className="max-w-xl mx-auto mb-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-deep dark:bg-gold-burnished rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 overflow-hidden fabric-texture">
            <Scissors className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-indigo-deep dark:text-soft-bone">
              Textile Agent
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gold-burnished/80 dark:text-gold-burnished font-semibold">
              Quality & Sales Intelligence
            </p>
          </div>
        </div>
        <button 
          id="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full glass-card hover:bg-white/80 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5 text-gold-burnished" /> : <Moon className="w-5 h-5 text-indigo-deep" />}
        </button>
      </header>

      <main className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-3xl p-8 fabric-texture overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Wind className="w-32 h-32" />
              </div>

              <h2 className="font-serif text-2xl mb-2 text-slate-800 dark:text-soft-bone">Fabric Specifications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Enter the details of your heritage textile for analysis.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <InputGroup 
                    label="Fiber Type" 
                    icon={<Scissors className="w-4 h-4" />} 
                    placeholder="e.g. 100% Organic Silk"
                    value={specs.fiberType}
                    onChange={(v) => setSpecs({ ...specs, fiberType: v })}
                  />
                  <InputGroup 
                    label="GSM / Weight" 
                    icon={<Scale className="w-4 h-4" />} 
                    placeholder="e.g. 15mm or 50 GSM"
                    value={specs.gsm}
                    onChange={(v) => setSpecs({ ...specs, gsm: v })}
                  />
                  <InputGroup 
                    label="Weave / Knit" 
                    icon={<Wind className="w-4 h-4" />} 
                    placeholder="e.g. Charmeuse, Twill"
                    value={specs.weave}
                    onChange={(v) => setSpecs({ ...specs, weave: v })}
                  />
                  <InputGroup 
                    label="Finish" 
                    icon={<Sparkles className="w-4 h-4" />} 
                    placeholder="e.g. Sand washed, Raw"
                    value={specs.finish}
                    onChange={(v) => setSpecs({ ...specs, finish: v })}
                  />
                 <InputGroup 
                    label="Intended Use" 
                    icon={<ShoppingBag className="w-4 h-4" />} 
                    placeholder="e.g. Evening gown, Upholstery"
                    value={specs.useCase}
                    onChange={(v) => setSpecs({ ...specs, useCase: v })}
                  />
                </div>

                {/* Design Visualization Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <h3 className="text-sm uppercase tracking-[0.2em] font-extrabold text-indigo-950 dark:text-slate-300 ml-1">
                    Design Visualization
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {VIZ_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSpecs({ ...specs, vizOption: opt.value === specs.vizOption ? '' : opt.value })}
                        className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                          specs.vizOption === opt.value 
                            ? 'bg-indigo-deep text-white border-indigo-deep shadow-md' 
                            : 'bg-white/40 dark:bg-black/10 border-slate-200 dark:border-white/10 hover:border-indigo-deep/30'
                        }`}
                      >
                        <div className={`mt-0.5 ${specs.vizOption === opt.value ? 'text-gold-burnished' : 'text-indigo-deep dark:text-gold-burnished'}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-bold leading-none mb-1.5 ${specs.vizOption === opt.value ? 'text-white' : 'text-slate-900 dark:text-soft-bone'}`}>
                            {opt.title}
                          </p>
                          <p className={`text-[10px] leading-tight font-medium ${specs.vizOption === opt.value ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  id="analyze-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-indigo-deep dark:bg-gold-burnished text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/10 dark:shadow-gold-900/10"
                >
                  Generate Intelligence
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-gold-burnished/20 border-t-gold-burnished rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wind className="w-8 h-8 text-indigo-deep dark:text-gold-burnished animate-pulse" />
                </div>
              </div>
              <h3 className="mt-8 font-serif text-xl text-indigo-deep dark:text-soft-bone">Weaving your insights...</h3>
              <p className="text-sm text-slate-500 mt-2">Our AI expert is analyzing fiber patterns and market trends.</p>
            </motion.div>
          )}

          {step === 'clarify' && (
            <motion.div
              key="clarify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 fabric-texture"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gold-burnished/10 rounded-2xl">
                  <HelpCircle className="w-6 h-6 text-gold-burnished" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-slate-800 dark:text-soft-bone">More details needed</h2>
                  <p className="text-xs text-slate-500">To provide accurate technical advice, please clarify:</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {analysis?.questions?.map((q, i) => (
                  <div key={i} className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-white/20 flex gap-3">
                    <MessageSquare className="w-4 h-4 text-indigo-deep dark:text-gold-burnished flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{q}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStep('home')}
                className="w-full bg-slate-800 dark:bg-zinc-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Refine Inputs
              </button>
            </motion.div>
          )}

          {step === 'results' && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Marketing Card */}
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-3xl p-8 fabric-texture relative overflow-hidden"
              >
                <div className="bg-gold-burnished text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-6 font-bold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Premium Marketing
                </div>
                <h2 className="font-serif text-3xl font-bold mb-4 leading-tight text-indigo-deep dark:text-soft-bone">
                  {analysis.marketing?.headline}
                </h2>
                <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-6 leading-relaxed border-l-2 border-gold-burnished pl-4">
                  "{analysis.marketing?.story}"
                </p>
                <ul className="space-y-3 mb-8">
                  {analysis.marketing?.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-gold-burnished">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="p-4 rounded-2xl bg-indigo-deep text-white text-center font-bold text-sm tracking-wide">
                  {analysis.marketing?.cta}
                </div>
              </motion.section>

              {/* Visualization Advice Card */}
              {analysis.visualizationAdvice && (
                 <motion.section 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.15 }}
                 className="glass-card rounded-3xl p-8 fabric-texture bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-200/50 dark:border-indigo-800/30"
               >
                 <div className="bg-indigo-600 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-6 font-bold flex items-center gap-1.5">
                   <PaletteIcon className="w-3 h-3" />
                   Design Optimization
                 </div>
                 <div className="markdown-content text-sm leading-relaxed text-slate-700 dark:text-indigo-50 space-y-4">
                    <ReactMarkdown>{analysis.visualizationAdvice}</ReactMarkdown>
                 </div>
               </motion.section>
              )}

              {/* Sales Card */}
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-3xl p-8 fabric-texture"
              >
                <div className="bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-soft-bone text-[10px] uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-6 font-bold flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Sales Summary
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  {analysis.sales?.summary}
                </p>
                
                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-bold">Technical Specifications</h4>
                <div className="text-xs font-mono bg-white/40 dark:bg-black/20 p-4 rounded-xl mb-6">
                  {analysis.sales?.techSpecsText}
                </div>

                <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 font-bold">Target Use Cases</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.sales?.useCases.map((u, i) => (
                    <span key={i} className="bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full text-[10px] font-medium border border-white/20">
                      {u}
                    </span>
                  ))}
                </div>
              </motion.section>

              {/* Quality Card */}
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-3xl p-8 fabric-texture border-t-4 border-t-gold-burnished"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gold-burnished" />
                    Quality Checklist
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {analysis.quality?.points.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight mb-0.5 text-slate-500">{p.label}</p>
                        <p className="text-sm">{p.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <button 
                onClick={reset}
                className="w-full text-indigo-deep dark:text-soft-bone font-bold text-sm underline flex items-center justify-center gap-2 py-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Analyze New Fabric
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">© 2026 Textile Intelligence Hub • Premium Craftsmanship</p>
      </footer>
    </div>
  );
}

function InputGroup({ label, icon, placeholder, value, onChange }: { label: string, icon: React.ReactNode, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-indigo-950 dark:text-slate-300 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-burnished opacity-50">
          {icon}
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/50 dark:bg-black/10 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold-burnished/20 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600"
        />
      </div>
    </div>
  );
}
