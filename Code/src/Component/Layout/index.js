// Main responsive layout components
export {
  ResponsiveProvider,
  ResponsivePageHeader,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveFormField,
  ResponsiveCard,
  ResponsiveActionBar,
  ResponsiveSection,
  ResponsiveTableContainer,
  useResponsive,
  useResponsiveContext
} from './ResponsiveLayout';

// Page layout components
export {
  default as ResponsivePageLayout,
  SimpleResponsivePage,
  FullWidthResponsivePage
} from './ResponsivePageLayout';

// Header components
export {
  default as ResponsiveHeader,
  ResponsiveHeaderSpaced,
  ResponsiveMobileHeader
} from './ResponsiveHeader';

// Page wrapper components
export {
  default as ResponsivePageWrapper,
  ResponsiveDashboardWrapper,
  ResponsiveFormWrapper,
  ResponsiveTableWrapper
} from './ResponsivePageWrapper';

// Typography components
export {
  ResponsivePageTitle,
  ResponsiveSectionTitle,
  ResponsiveCardTitle,
  ResponsiveBodyText,
  ResponsiveCaptionText,
  ResponsiveSubtitle,
  ResponsiveButtonText,
  ResponsiveListText,
  responsiveFontSizes,
  responsiveLineHeights
} from './ResponsiveTypography';

// Page templates
export {
  default as ResponsivePageTemplate,
  ResponsiveListPageTemplate,
  ResponsiveFormPageTemplate,
  ResponsiveDashboardTemplate,
  ResponsiveCardGrid,
  ResponsivePageTableWrapper
} from './ResponsivePageTemplate';

// Re-export the main layout as default
export { default } from './ResponsiveLayout';