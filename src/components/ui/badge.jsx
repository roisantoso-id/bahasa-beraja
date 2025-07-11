import React from 'react';

// 临时的cn函数
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 临时的cva函数，直到我们安装依赖
const cva = (baseClasses, config) => {
  return (props = {}) => {
    let classes = baseClasses;
    
    if (config.variants) {
      Object.keys(config.variants).forEach(variantKey => {
        const variantValue = props[variantKey];
        if (variantValue && config.variants[variantKey][variantValue]) {
          classes += ' ' + config.variants[variantKey][variantValue];
        }
      });
    }
    
    return classes;
  };
};

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:from-blue-600 hover:to-blue-700",
        secondary:
          "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-sm hover:from-gray-200 hover:to-gray-300",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700",
        outline: "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm",
        indonesian:
          "border-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-sm hover:from-amber-600 hover:via-orange-600 hover:to-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = React.forwardRef(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  >
    {children}
  </div>
));
Badge.displayName = "Badge";

export { Badge, badgeVariants }; 