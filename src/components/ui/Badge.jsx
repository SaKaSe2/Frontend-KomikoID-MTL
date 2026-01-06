import clsx from 'clsx';

export default function Badge({ children, variant = 'default', size = 'md', className }) {
    const variants = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        ongoing: 'bg-blue-500 text-white',
        completed: 'bg-green-500 text-white',
        hiatus: 'bg-yellow-500 text-black',
    };

    const sizes = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center font-medium rounded-full',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}
