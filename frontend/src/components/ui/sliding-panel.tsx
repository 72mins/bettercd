import type * as React from 'react';

import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const panelVariants = cva(
    'absolute top-0 right-0 h-full bg-background border-l transition-all duration-300 ease-in-out',
    {
        variants: {
            size: {
                sm: 'w-64',
                md: 'w-80',
                lg: 'w-96',
                xl: 'w-[30rem]',
                full: 'w-full',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

export interface SlidingPanelProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof panelVariants> {
    open?: boolean;
    onClose?: () => void;
    showCloseButton?: boolean;
    closeButtonClassName?: string;
    containerClassName?: string;
    contentClassName?: string;
}

export function SlidingPanel({
    children,
    className,
    open = false,
    size,
    onClose,
    showCloseButton = true,
    closeButtonClassName,
    containerClassName,
    contentClassName,
    ...props
}: SlidingPanelProps) {
    const panelWidthMap = {
        sm: '16rem',
        md: '20rem',
        lg: '24rem',
        xl: '30rem',
        full: '80rem',
    };

    const panelWidth = panelWidthMap[size || 'md'];

    return (
        <div className={cn('relative overflow-hidden', containerClassName)}>
            <div
                className={cn('transition-all duration-300 ease-in-out', contentClassName)}
                style={{
                    marginRight: open ? panelWidth : '0',
                }}
                {...props}
            >
                {/* @ts-expect-error Explicitly calling children instead of props.children breaks the component */}
                {props.children}
            </div>
            <div className={cn(panelVariants({ size }), open ? 'translate-x-0' : '', className)}>
                {showCloseButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn('absolute top-4 right-4', closeButtonClassName)}
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                )}
                {children}
            </div>
        </div>
    );
}
