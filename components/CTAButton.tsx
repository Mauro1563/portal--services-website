'use client';

import * as React from 'react';

import { Button } from './ui';
import { useContactModal } from './ContactModal';

type ButtonProps = React.ComponentProps<typeof Button>;

interface CTAButtonProps extends Omit<ButtonProps, 'href' | 'onClick'> {
  subject: string;
}

export function CTAButton({ subject, children, ...rest }: CTAButtonProps) {
  const { open } = useContactModal();
  return (
    <Button {...rest} onClick={() => open(subject)}>
      {children}
    </Button>
  );
}
