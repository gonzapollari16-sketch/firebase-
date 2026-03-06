'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { Filters as FiltersType } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { propertyTypes, operations } from '@/lib/location-data';
import IntelligentLocationFilter from './intelligent-location-filter';


export default function Filters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string | number | boolean) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === '' || value === null || value === undefined || value === 0 || value === false) {
                params.delete(name);
            } else {
                params.set(name, String(value));
            }
            return params.toString();
        },
        [searchParams]
    );

    const onFilterChange = (filterName: keyof FiltersType, value: any) => {
        router.push(pathname + '?' + createQueryString(filterName, value), { scroll: false });
    };
    
    const getFilterValue = (name: keyof FiltersType) => searchParams.get(name) || '';
    const getBooleanFilterValue = (name: keyof FiltersType) => searchParams.get(name) === 'true';

    return (
        <Accordion type="multiple" defaultValue={['operacion', 'precio', 'ubicacion']} className="w-full">
            <AccordionItem value="operacion">
                <AccordionTrigger>Operación</AccordionTrigger>
                <AccordionContent className="space-y-4 px-1">
                    <Select onValueChange={(value) => onFilterChange('operacion', value)} value={getFilterValue('operacion')}>
                        <SelectTrigger><SelectValue placeholder="Tipo de Operación" /></SelectTrigger>
                        <SelectContent>
                            {operations.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tipo">
                <AccordionTrigger>Tipo de Propiedad</AccordionTrigger>
                <AccordionContent className="space-y-4 px-1">
                    <Select onValueChange={(value) => onFilterChange('tipo', value)} value={getFilterValue('tipo')}>
                        <SelectTrigger><SelectValue placeholder="Tipo de Propiedad" /></SelectTrigger>
                        <SelectContent>
                            {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="precio">
                <AccordionTrigger>Precio</AccordionTrigger>
                <AccordionContent className="space-y-4 px-1">
                    <div className="flex items-center gap-2">
                        <Select onValueChange={(value) => onFilterChange('moneda', value)} defaultValue={getFilterValue('moneda') || 'U$S'}>
                            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="U$S">U$S</SelectItem>
                                <SelectItem value="$">$</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input placeholder="Mínimo" type="number" value={getFilterValue('precioMin')} onChange={(e) => onFilterChange('precioMin', e.target.valueAsNumber || undefined)} />
                        <Input placeholder="Máximo" type="number" value={getFilterValue('precioMax')} onChange={(e) => onFilterChange('precioMax', e.target.valueAsNumber || undefined)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ubicacion">
                <AccordionTrigger>Ubicación</AccordionTrigger>
                <AccordionContent className="px-1">
                    <IntelligentLocationFilter onFilterChange={onFilterChange} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="caracteristicas">
                <AccordionTrigger>Características</AccordionTrigger>
                <AccordionContent className="space-y-4 px-1">
                    <Select onValueChange={(value) => onFilterChange('banos', value)} value={getFilterValue('banos')}>
                        <SelectTrigger><SelectValue placeholder="Baños" /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map(b => <SelectItem key={b} value={String(b)}>{b}+ baño{b > 1 ? 's' : ''}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="aEstrenar" checked={getBooleanFilterValue('aEstrenar')} onCheckedChange={(checked) => onFilterChange('aEstrenar', checked as boolean)} />
                        <Label htmlFor="aEstrenar" className="font-normal">A Estrenar</Label>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mas-filtros">
                <AccordionTrigger>Más Filtros</AccordionTrigger>
                <AccordionContent className="space-y-2 px-1">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="aptoCredito" checked={getBooleanFilterValue('aptoCredito')} onCheckedChange={(checked) => onFilterChange('aptoCredito', checked as boolean)} />
                        <Label htmlFor="aptoCredito" className="font-normal">Apto Crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="escritura" checked={getBooleanFilterValue('escritura')} onCheckedChange={(checked) => onFilterChange('escritura', checked as boolean)} />
                        <Label htmlFor="escritura" className="font-normal">Con Escritura</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="pozo" checked={getBooleanFilterValue('pozo')} onCheckedChange={(checked) => onFilterChange('pozo', checked as boolean)} />
                        <Label htmlFor="pozo" className="font-normal">Desde el Pozo</Label>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
