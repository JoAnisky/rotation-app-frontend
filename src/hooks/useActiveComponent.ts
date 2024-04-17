import { useState, useCallback } from "react";

// Interface to configure the hook
interface ComponentConfig {
  defaultComponent: string; // Default component key to display
  components: Record<string, React.ReactNode>; // Dictionary of components keyed by string
}

/**
 * Custom hook for managing active component state with localStorage persistence.
 *
 * @param defaultComponent Initial key for default component when no saved state exists.
 * @param components Mapping of component keys to ReactNode elements.
 * @returns {Object} with methods to set and get the active component.
 *         - setActiveComponent (function): Updates the active component based on key.
 *         - renderActiveComponent (function): Returns the JSX of the active component.
 */
const useActiveComponent = ({
  defaultComponent,
  components,
}: ComponentConfig)=> {
  const [activeComponentKey, setActiveComponentKey] = useState<string>(() => {
    // Retrieve from localStorage or use defaultComponent
    const savedComponent = localStorage.getItem("activeComponent");
    return savedComponent !== null ? savedComponent : defaultComponent;
  });

  const setActiveComponent = useCallback((componentKey: string) => {
    localStorage.setItem("activeComponent", componentKey); // Save new state to localStorage
    setActiveComponentKey(componentKey); // Update local state
  }, []);

  const renderActiveComponent = useCallback(() => {
    // Return JSX for the current active component or the default
    return components[activeComponentKey] || components[defaultComponent];
  }, [activeComponentKey, components, defaultComponent]);

  return { setActiveComponent, renderActiveComponent };
};

export default useActiveComponent;
