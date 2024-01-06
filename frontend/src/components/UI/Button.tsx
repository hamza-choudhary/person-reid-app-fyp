import { ReactNode, ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ className = '', children, ...attributes }) => {
  const buttonClass = `px-3 text-white rounded-sm bg-primary ${className}`;

  return (
    <button className={buttonClass} {...attributes}>
      {children}
    </button>
  );
};

export default Button;
