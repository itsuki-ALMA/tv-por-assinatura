// types/jspdf-barcode.d.ts
declare module 'jspdf-barcode' {
    import { jsPDF } from 'jspdf';
  
    export function Barcode(doc: jsPDF, code: string, x: number, y: number, options?: any): void;
  }
  