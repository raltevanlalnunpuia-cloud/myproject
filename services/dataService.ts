
import * as XLSX from 'xlsx';
import { Project, SectorType, ProjectStatus } from '../types';
import { SHEET_URL } from '../constants';

const parseSafeNumber = (val: any): number => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

const determineStatus = (phy: number, targetDateStr: string): ProjectStatus => {
  if (phy >= 100) return 'Completed';
  if (phy > 0) return 'Ongoing';
  
  if (targetDateStr && targetDateStr !== 'NA' && targetDateStr !== 'Not started') {
    try {
      let targetDate: Date;
      if (typeof targetDateStr === 'number') {
        targetDate = new Date((targetDateStr - 25569) * 86400 * 1000);
      } else {
        const parts = String(targetDateStr).split(/[-/.]/);
        if (parts.length === 3) {
          targetDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          targetDate = new Date(targetDateStr);
        }
      }

      if (!isNaN(targetDate.getTime()) && targetDate < new Date() && phy < 100) {
        return 'Delay';
      }
    } catch (e) {
      // Date error ignored
    }
  }
  
  return 'Not started';
};

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const xlsxUrl = SHEET_URL.replace('output=csv', 'output=xlsx');
    const response = await fetch(xlsxUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const projects: Project[] = [];

    const sectorMap: Record<string, SectorType> = {
      '0': 'Water Supply',
      '1': 'Sewerage & Septage',
      '2': 'Waterbody Rejuvenation',
      '3': 'Green Spaces & Parks'
    };

    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      let sector: SectorType = 'Water Supply';
      const upperName = sheetName.toUpperCase();
      if (upperName.includes('SEWER')) sector = 'Sewerage & Septage';
      else if (upperName.includes('BODY') || upperName.includes('REJUVENATION')) sector = 'Waterbody Rejuvenation';
      else if (upperName.includes('GREEN') || upperName.includes('PARK')) sector = 'Green Spaces & Parks';
      else if (upperName.includes('WATER') && !upperName.includes('BODY')) sector = 'Water Supply';
      else {
        sector = sectorMap[String(index)] || 'Water Supply';
      }

      let validProjectCounter = 0;

      data.forEach((row) => {
        const slNoRaw = row[0];
        if (slNoRaw && /^\d+$/.test(String(slNoRaw).trim())) {
          // Rule: Remove first row from water supply specifically
          if (sector === 'Water Supply' && validProjectCounter === 0) {
            validProjectCounter++;
            return;
          }

          const slNo = String(slNoRaw).trim();
          const name = String(row[1] || '').trim();
          const ulb = String(row[2] || '').trim();
          const cost = parseSafeNumber(row[3]);
          const received = parseSafeNumber(row[4]);
          const start = row[5] ? String(row[5]) : 'NA';
          const end = row[6] ? String(row[6]) : 'NA';
          const phy = parseSafeNumber(row[7]);
          const fin = parseSafeNumber(row[8]);
          const remarks = String(row[9] || '').trim();

          if (name && name !== 'Name of Project') {
            projects.push({
              slNo,
              name,
              ulb,
              approvedCost: cost,
              receivedAmount: received,
              commencementDate: start,
              targetCompletionDate: end,
              physicalProgress: phy,
              financialProgress: fin,
              remarks,
              sector,
              status: determineStatus(phy, end),
            });
            validProjectCounter++;
          }
        }
      });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching/parsing XLSX data:', error);
    return [];
  }
};
