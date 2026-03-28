"use client";

import { motion } from "framer-motion";
import { Lock, MapPin, TrendingUp, Building2, Eye, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="flex flex-col h-full overflow-hidden border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="h-2 w-full bg-gradient-to-r from-df-trust-blue to-df-navy" />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-slate-50 text-df-navy border-slate-200 font-medium">
            M&A Prilika #{id}
          </Badge>
          {isVerified && (
            <Badge className="bg-green-100 hover:bg-green-100 text-green-700 border-none flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" /> Verificirano
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-df-navy font-dm-sans line-clamp-2">
          Slijepi Teaser: Tvrtka u sektoru {industry}
        </h3>
        
        <div className="flex items-center text-slate-500 text-sm mt-2 font-medium">
          <MapPin className="w-4 h-4 mr-1 text-df-trust-blue" />
          {region}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Godišnji Prihod</p>
            <p className="text-lg font-bold text-df-navy">{formatCurrency(revenue)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">EBITDA</p>
            <p className="text-lg font-bold text-df-navy">{formatCurrency(ebitda)}</p>
          </div>
        </div>

        {/* AI Blind Teaser Excerpt */}
        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-df-trust-blue rounded-r-md opacity-20" />
          <div 
            className="text-sm text-slate-600 space-y-2 line-clamp-4 pl-2"
            dangerouslySetInnerHTML={{ __html: blindTeaserHtml }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/70 to-transparent" />
        </div>
        
        <div className="pt-2">
           <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Očekivana Cijena</p>
           <p className="text-2xl font-bold text-df-gold">{formatCurrency(askingPrice)}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-100 bg-slate-50/30 flex gap-3">
        <Button variant="outline" className="flex-1 border-df-trust-blue/20 text-df-navy hover:bg-df-trust-blue/5">
          <Eye className="w-4 h-4 mr-2" />
          Teaser
        </Button>
        <Button className="flex-1 bg-df-navy hover:bg-df-navy/90 text-white">
          <Lock className="w-4 h-4 mr-2" />
          Zatraži NDA
        </Button>
      </CardFooter>
    </Card>
  );
}
