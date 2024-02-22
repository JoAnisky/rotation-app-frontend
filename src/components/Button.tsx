import React from 'react';
import Button from '@mui/material/Button';

interface ButtonUsageProps {
  text: string;
}

const ButtonUsage: React.FC<ButtonUsageProps> = ({text}) => {
  return <Button variant="contained" className='btnChoiceRole'>{text}</Button>;
}

export default ButtonUsage;