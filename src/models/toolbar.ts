import type { LucideIcon } from 'lucide-vue-next';

export interface TabIconImage {
  type: 'image';
  src: string;
  alt?: string;
}
export type TabIcon = string | LucideIcon | TabIconImage;

export type Linkable = {
  to?: string;
  href?: string;
  onClick?: () => void;
};

export type Item = Linkable & {
  key: string;
  label: string;
  icon?: TabIcon;
};

export type Fab = Linkable & {
  label?: string;
  icon?: TabIcon;
};
