"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ShieldCheck, HelpCircle, Users } from 'lucide-react';

interface DuplicatePropertyWarningProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (resolution: string) => void;
  matchScore: number;
}

export function DuplicatePropertyWarning({ isOpen, onOpenChange, onConfirm, matchScore }: DuplicatePropertyWarningProps) {
  const [selectedValue, setSelectedValue] = useState("report-error");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(selectedValue === 'other' ? reason : selectedValue);
  };

  const percentage = Math.round(matchScore * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[#020617] border-[#1e293b] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Posible Propiedad Duplicada Detectada
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Alert variant="default" className="bg-amber-500/10 border-amber-500/50 text-amber-500">
            <AlertTitle className="font-bold">Alerta de Exclusividad</AlertTitle>
            <AlertDescription>
              Nuestro motor detectó un <strong>{percentage}% de similitud</strong> con una propiedad ya existente en la red. 
              Para proteger el mercado, CRUSHOME no permite duplicados públicos.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label className="text-muted-foreground">¿Cómo deseas proceder?</Label>
            <RadioGroup value={selectedValue} onValueChange={setSelectedValue} className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <RadioGroupItem value="copublish" id="opt-copublish" className="mt-1" />
                <Label htmlFor="opt-copublish" className="flex-1 cursor-pointer">
                  <div className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Solicitar Co-publicación</div>
                  <p className="text-xs text-muted-foreground">Compartirás la ficha pública con la agencia original.</p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <RadioGroupItem value="report-error" id="opt-error" className="mt-1" />
                <Label htmlFor="opt-error" className="flex-1 cursor-pointer">
                  <div className="font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Es un error - Revisión manual</div>
                  <p className="text-xs text-muted-foreground">Un administrador validará si realmente es una propiedad distinta.</p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                <RadioGroupItem value="other" id="opt-other" className="mt-1" />
                <Label htmlFor="opt-other" className="flex-1 cursor-pointer">
                  <div className="font-bold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400" /> Otro motivo</div>
                  <p className="text-xs text-muted-foreground">Especificar detalles sobre esta unidad específica.</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {selectedValue === 'other' && (
            <Textarea
              placeholder="Explica por qué esta carga es válida..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-black/40 border-white/10 text-white min-h-[100px]"
            />
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
              Cancelar Carga
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8">
            Confirmar y Reportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
