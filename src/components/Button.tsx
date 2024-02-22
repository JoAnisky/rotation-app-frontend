import React from 'react';
import Button from '@mui/material/Button';
import { LinkProps } from 'react-router-dom';
interface ButtonUsageProps {
  to: LinkProps['to'];  // Using 'to' prop from LinkProps
  text: string;
  component: React.ElementType;  // Defining the type for the 'component' prop
}

const ButtonUsage: React.FC<ButtonUsageProps> = ({text}) => {
  return <Button variant="contained" className='btnChoice'>{text}</Button>;
}

export default ButtonUsage;