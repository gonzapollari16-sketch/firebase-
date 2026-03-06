'use client';

/**
 * @fileOverview Evaluador de condiciones para el Rules Engine.
 * Optimizado para soportar jerarquías geográficas y tipos complejos.
 */

import { AutomationCondition, AutomationRule } from './types';
import { GeographicEngine } from '../geo/geographic-engine';

export class RulesEvaluator {
  /**
   * Evalúa si una regla debe ejecutarse basada en los datos del evento.
   */
  static shouldExecute(rule: AutomationRule, data: any): boolean {
    if (!rule.enabled) return false;
    if (rule.conditions.length === 0) return true;

    // Todas las condiciones deben cumplirse (AND lógico)
    return rule.conditions.every(condition => this.evaluateCondition(condition, data));
  }

  /**
   * Lógica de comparación de operadores.
   */
  static evaluateCondition(condition: AutomationCondition, data: any): boolean {
    const { field, operator, value } = condition;
    
    // Manejo especial para geografía
    if (field === 'location' || field.startsWith('address.')) {
      return this.evaluateGeoCondition(field, operator, value, data);
    }

    const actualValue = this.getNestedValue(data, field);
    if (actualValue === undefined) return false;

    switch (operator) {
      case 'equals':
        return actualValue === value;
      case 'not_equals':
        return actualValue !== value;
      case 'gt':
        return actualValue > value;
      case 'lt':
        return actualValue < value;
      case 'contains':
        return typeof actualValue === 'string' && actualValue.toLowerCase().includes(String(value).toLowerCase());
      case 'in_list':
        return Array.isArray(value) && value.includes(actualValue);
      default:
        return false;
    }
  }

  /**
   * Evaluación de pertenencia territorial jerárquica.
   */
  private static evaluateGeoCondition(field: string, operator: string, value: any, data: any): boolean {
    const propGeo = {
      provincia: data.provincia || data.address?.provincia,
      ciudad: data.ciudad || data.address?.ciudad,
      barrio: data.barrio || data.address?.barrio
    };

    if (operator === 'equals' || operator === 'in_list') {
      const filterGeo = typeof value === 'string' ? { barrio: value } : value;
      return GeographicEngine.isMatch(propGeo, filterGeo);
    }

    return false;
  }

  /**
   * Obtiene valores de objetos anidados.
   */
  static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }
}
