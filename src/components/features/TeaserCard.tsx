"use client";

import { motion } from "framer-motion";
import { Lock, MapPin, Building2, Eye, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import Image from "next/image";

interface TeaserCardProps {
  id: string;
  industry: string;
  region: string;
  revenue: number;
  ebitda: number;
  askingPrice: number;
  blindTeaserHtml: string;
  isVerified?: boolean;
}

// Map industry to abstract architectural/business Unsplash image
const getIndustryImage = (industry: string) => {
  const map: Record<string, string> = {
    "IT & Softver": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    "Proizvodnja": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    "Turizam": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    "Trgovina": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  };
  return map[industry] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop";
};

export function TeaserCard({ 
  id, 
  industry, 
  region, 
  revenue, 
  ebitda, 
  askingPrice, 
  blindTeaserHtml,
  isVerified = true
}: TeaserCardProps) {
  
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <GlowCard className="flex flex-col h-full !bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,33,71,0.08)]">
        
        {/* Dynamic Image Reveal on Hover */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-15 mix-blend-multiply transition-opacity duration-700 ease-out">
          <Image 
            src={getIndustryImage(industry)}
            alt={`${industry} background`}
            fill
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out grayscale"
          />
        </div>

        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 w-full bg-gradient-to-r from-df-trust-blue via-df-navy to-df-gold opacity-80 z-10" />
        
        <CardHeader className="pb-4 pt-8 px-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="bg-white/80 text-df-navy border-slate-200/50 font-medium px-3 py-1 shadow-sm backdrop-blur-sm tracking-wide text-xs">
              PRILIKA #{id}
            </Badge>
            {isVerified && (
              <Badge className="bg-[#E8F5E9] hover:bg-[#E8F5E9] text-[#1B5E20] border-none flex items-center gap-1.5 font-semibold px-3 py-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificirano
              </Badge>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-df-navy font-jakarta line-clamp-2 leading-tight group-hover:text-df-trust-blue transition-colors duration-300">
            Slijepi Teaser: Tvrtka u sektoru {industry}
          </h3>
          
          <div className="flex items-center text-slate-500 text-sm mt-3 font-medium">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-df-trust-blue/10 mr-2">
              <MapPin className="w-3.5 h-3.5 text-df-trust-blue" />
            </div>
            {region}
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-6 px-6 relative z-10">
          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-gradient-to-br from-slate-50/80 to-white/40 border border-slate-200/50 shadow-inner group-hover:border-df-trust-blue/20 transition-colors duration-500">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Prihod (Godišnji)</p>
              </div>
              <p className="text-xl font-bold text-df-navy font-inter tracking-tight">{formatCurrency(revenue)}</p>
            </div>
            <div className="flex flex-col border-l border-slate-200/60 pl-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">EBITDA</p>
              </div>
              <p className="text-xl font-bold text-df-navy font-inter tracking-tight">{formatCurrency(ebitda)}</p>
            </div>
          </div>

          {/* AI Blind Teaser Excerpt */}
          <div className="relative mt-6">
            <div className="absolute -left-3 top-2 bottom-2 w-1 bg-gradient-to-b from-df-trust-blue to-transparent rounded-r-md opacity-30" />
            <div 
              className="text-sm text-slate-600 space-y-2 line-clamp-4 pl-1 font-inter leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blindTeaserHtml }}
            />
            {/* Fade out bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>
          
          <div className="pt-2 flex items-end justify-between border-t border-slate-100 mt-4">
             <div>
               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Očekivana Cijena</p>
               <p className="text-2xl font-black text-df-gold drop-shadow-sm font-jakarta">{formatCurrency(askingPrice)}</p>
             </div>
          </div>
        </CardContent>

        <CardFooter className="pt-5 pb-6 px-6 bg-slate-50/50 border-t border-slate-100 flex gap-3 mt-auto relative z-10">
          <Button variant="outline" className="flex-1 bg-white border-slate-200 hover:border-df-trust-blue hover:bg-df-trust-blue/5 hover:text-df-trust-blue text-slate-700 font-semibold shadow-sm transition-all h-11">
            <Eye className="w-4 h-4 mr-2" />
            Teaser
          </Button>
          <Button className="flex-1 bg-df-navy hover:bg-df-navy/90 text-white font-semibold shadow-md hover:shadow-lg transition-all h-11 group/btn">
            <Lock className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            NDA Zahtjev
          </Button>
        </CardFooter>
      </GlowCard>
    </motion.div>
  );
}

