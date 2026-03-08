declare module "react-usa-map" {
  import { ComponentType } from "react";

  interface USAMapProps {
    customize?: Record<string, { fill?: string; clickHandler?: () => void }>;
    defaultFill?: string;
    onClick?: (state: string) => void;
    width?: number;
    height?: number;
  }

  const USAMap: ComponentType<USAMapProps>;
  export default USAMap;
}
