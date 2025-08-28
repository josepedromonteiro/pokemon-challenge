import type { DynamicColumn } from '@/components/DynamicTable.vue';

export const COLUMNS: DynamicColumn[] = [
  { class: 'w-14 min-w-[56px] shrink-0', key: 'sprite', label: '' },
  {
    cellClass: 'sticky-col left-0',
    class: 'sticky-col left-0',
    key: 'name',
    label: 'Name',
  },
  { class: 'min-w-[120px]', key: 'types', label: 'Types' },
  { key: 'hp', label: 'Health (HP)' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Special attack' },
  { key: 'specialDefense', label: 'Special defense' },
  { key: 'speed', label: 'Speed' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { class: 'l', key: 'caughtAt', label: 'Caught' },
  {
    cellClass: 'text-center sticky-col right-0',
    class: 'sticky-col right-0 text-center',
    key: 'actions',
    label: '',
  },
];
