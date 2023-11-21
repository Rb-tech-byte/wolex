import { ReactNode } from 'react';
import LayoutMain from './_layout_main/LayoutMain';

type Props = {
  children: ReactNode;
  variant?: 'main' | 'logoOnly' | 'main';
};

export default function Layout({ children, variant = 'main' }: Props) {
  if (variant === 'main') return <LayoutMain>{children}</LayoutMain>;
  return <LayoutMain>{children}</LayoutMain>;
}
