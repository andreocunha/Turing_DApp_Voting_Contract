import React from "react";
import Image from "next/image";

interface ButtonLoginProps {
  onSubmit: () => void;
}

export function ButtonLogin({ onSubmit }: ButtonLoginProps) {
  return (
    <button type="button" className="text-gray-300 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-500 dark:border-gray-700 dark:text-white dark:hover:bg-gray-300 mr-2 mb-2"
      onClick={onSubmit}
    >
      <Image src="/metamask.svg" alt="Metamask" width={24} height={24} style={{ marginRight: 10 }}/>
      Conectar com MetaMask
    </button>
  );
}