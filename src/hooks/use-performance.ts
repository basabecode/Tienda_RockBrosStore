// Performance monitoring functionality - Currently disabled
// Uncomment and implement when needed

/*
import { useEffect } from 'react';

let performanceMonitor: any | null = null;

export const usePerformanceMonitoring = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize performance monitor
    if (!performanceMonitor) {
      // performanceMonitor = new PerformanceMonitor();
    }

    return () => {
      // Cleanup logic here if needed
    };
  }, [enabled]);

  return performanceMonitor;
};

export const getPerformanceMetrics = () => {
  return [];
};

export const getMetricsByName = (name: string) => {
  return [];
};

export const getAverageMetric = (name: string) => {
  return 0;
};
*/

// Simple stub exports for now
export const usePerformanceMonitoring = (enabled: boolean = true) => null
export const getPerformanceMetrics = () => []
export const getMetricsByName = (name: string) => []
export const getAverageMetric = (name: string) => 0
