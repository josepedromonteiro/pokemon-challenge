import type { DynamicColumn } from '@/components/DynamicTable.vue';

export const COLUMNS: DynamicColumn[] = [
  { key: 'sprite', label: '', class: 'w-14 min-w-[56px] shrink-0' },
  {
    key: 'name',
    label: 'Name',
    class: 'sticky-col left-0',
    cellClass: 'sticky-col left-0',
  },
  { key: 'types', label: 'Types', class: 'min-w-[120px]' },
  { key: 'hp', label: 'Health (HP)' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Special attack' },
  { key: 'specialDefense', label: 'Special defense' },
  { key: 'speed', label: 'Speed' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'caughtAt', label: 'Caught', class: 'l' },
  {
    key: 'actions',
    label: '',
    class: 'sticky-col right-0 text-center',
    cellClass: 'text-center sticky-col right-0',
  },
];
