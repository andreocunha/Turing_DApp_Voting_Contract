import React, { ReactNode } from "react";

interface FormProps {
  title: string;
  children?: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function Forms({ title, children, onSubmit }: FormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className='flex flex-col justify-center w-full max-w-md p-4 space-y-4 bg-gray-400 rounded-lg shadow-lg shadow-current'
    >
      <h1 className='text-white text-2xl font-bold text-center'>{title}</h1>
      {children}
    </form>
  );
}