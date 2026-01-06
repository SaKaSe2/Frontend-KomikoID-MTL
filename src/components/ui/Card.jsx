import clsx from 'clsx';

export default function Card({
    children,
    className,
    padding = 'md',
    hover = false,
    ...props
}) {
    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    return (
        <div
            className={clsx(
                'bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)]',
                'transition-all duration-200',
                paddings[padding],
                hover && 'hover:border-[var(--primary-500)] hover:shadow-lg cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Card Header
Card.Header = function CardHeader({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                'pb-4 mb-4 border-b border-[var(--border-primary)]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Body
Card.Body = function CardBody({ children, className, ...props }) {
    return (
        <div className={clsx('', className)} {...props}>
            {children}
        </div>
    );
};

// Card Footer
Card.Footer = function CardFooter({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                'pt-4 mt-4 border-t border-[var(--border-primary)]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
