import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { IconType } from 'react-icons';

export const Container: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={`bg-white border border-gray-100 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export const Title: FC<PropsWithChildren<{ Icon: IconType }>> = ({ children, Icon }) => {
  return (
    <h1 className="text-3xl font-bold flex gap-2 items-center">
      <Icon className="text-2xl" />
      <span>{children}</span>
    </h1>
  );
};
