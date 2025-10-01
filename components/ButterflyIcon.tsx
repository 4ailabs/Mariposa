
import React from 'react';

interface ButterflyIconProps extends React.SVGProps<SVGSVGElement> {
  // no custom props
}

const ButterflyIcon: React.FC<ButterflyIconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M12.383 3.033a1.5 1.5 0 00-2.316-1.066l-.11.066L3.38 6.31a1.5 1.5 0 00-.38 2.073l.08.103a1.5 1.5 0 002.072.38l.104-.08L11.25 4.5v15a.75.75 0 001.5 0v-15l5.993 4.28a1.5 1.5 0 002.072-.38l.08-.103a1.5 1.5 0 00-.38-2.073l-.11-.08-6.572-4.28z" />
  </svg>
);

export default ButterflyIcon;
