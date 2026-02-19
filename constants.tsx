
import React from 'react';
import { BookOpen, Users, Image as ImageIcon, FileText, Droplets, Trash2, Waves, Trees } from 'lucide-react';

export const SECTORS = [
  { id: 'Water Supply', label: 'Water Supply', icon: <Droplets className="w-5 h-5" /> },
  { id: 'Sewerage & Septage', label: 'Sewerage & Septage', icon: <Trash2 className="w-5 h-5" /> },
  { id: 'Waterbody Rejuvenation', label: 'Waterbody Rejuvenation', icon: <Waves className="w-5 h-5" /> },
  { id: 'Green Spaces & Parks', label: 'Green Spaces & Parks', icon: <Trees className="w-5 h-5" /> },
];

export const IMPORTANT_LINKS = [
  { label: 'Guidelines', url: 'https://udpa.mizoram.gov.in/uploads/attachments/2022/07/be3f6ec31bd1efceca254f0a084b2f46/amrut20-guidelines.pdf', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'SLTC & SHPSC Composition', url: 'https://udpa.mizoram.gov.in/uploads/attachments/2022/07/6dd78f47f2c1f70df61ab08002bfaa50/constitution-of-shpsc-and-sltc-under-amrut-20.PDF', icon: <Users className="w-4 h-4" /> },
  { label: 'Image Gallery', url: 'https://drive.google.com/drive/folders/1SY14HaYi_RFKQnEY3wtBnNZzGIHj0pHY', icon: <ImageIcon className="w-4 h-4" /> },
  { label: 'Documents', url: 'https://drive.google.com/drive/folders/1FF7A-DOdvlgWoYyio1mkiYNX-bfKAb6Y', icon: <FileText className="w-4 h-4" /> },
];

export const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZme4Qbyo1xIm7cW4pw6P0uFlcs739ybP7ic6qk8iTV5FCStIhO0K4vI2SKJLo0NkdscloUN1qFPXz/pub?output=csv';
