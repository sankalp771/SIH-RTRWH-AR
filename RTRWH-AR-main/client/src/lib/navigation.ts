/**
 * Shared navigation utilities for consistent scrolling behavior
 * and button handlers across components
 */

export type CalculationType = 'rainwater' | 'recharge';
export type SectionId = 'hero' | 'calculator' | 'about' | 'testimonials';

/**
 * Scrolls to a section by ID with smooth behavior
 * @param sectionId - The ID of the section to scroll to
 */
export const scrollToSection = (sectionId: SectionId): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Combined handler for calculator navigation that both scrolls to calculator
 * section and optionally sets the calculation type
 * @param calculationType - Optional type to distinguish between rainwater and recharge
 * @param onSelectPath - Optional callback to set the calculation path
 */
export const navigateToCalculator = (
  calculationType?: CalculationType,
  onSelectPath?: (path: CalculationType) => void
): void => {
  // First scroll to the calculator section
  scrollToSection('calculator');
  
  // If a calculation type and callback are provided, select that path
  if (calculationType && onSelectPath) {
    onSelectPath(calculationType);
  }
};

/**
 * Generic back navigation handler
 * @param onBack - The callback function to execute for back navigation
 * @param context - Optional context for debugging/logging
 */
export const handleBackNavigation = (
  onBack: () => void, 
  context?: string
): void => {
  if (context) {
    console.log(`Back navigation from: ${context}`);
  }
  onBack();
};

/**
 * Downloads PDF report with error handling
 * @param onDownloadPDF - The callback function to execute PDF download
 */
export const handlePDFDownload = async (onDownloadPDF: () => void | Promise<void>): Promise<void> => {
  try {
    await onDownloadPDF();
  } catch (error) {
    console.error('PDF download failed:', error);
    // Could add toast notification here in the future
  }
};