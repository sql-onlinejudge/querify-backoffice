import { Grid } from 'antd';

export function useResponsive() {
  const screens = Grid.useBreakpoint();
  return {
    isMobile: !screens.md,
    isTablet: !!screens.md && !screens.lg,
    isDesktop: !!screens.lg,
    screens,
  };
}
