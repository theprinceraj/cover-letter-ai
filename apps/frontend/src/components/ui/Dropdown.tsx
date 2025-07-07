import type React from "react";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-55 md:w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 cursor-pointer transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
