import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">Bloom</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

