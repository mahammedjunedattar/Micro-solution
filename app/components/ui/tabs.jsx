// components/ui/tabs.jsx
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'
const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1 rounded-lg bg-gray-100 p-1',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'data-[state=active]:bg-white',
          'data-[state=active]:shadow-sm',
          'data-[state=active]:text-gray-900',
          'hover:text-gray-900',
          'text-gray-600'
        ],
        filled: [
          'data-[state=active]:bg-indigo-600',
          'data-[state=active]:text-white',
          'hover:bg-indigo-100',
          'text-gray-700'
        ]
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

const TabsTrigger = React.forwardRef(
    ({ className, variant, size, ...props }, ref) => (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant, size }), className)}
        {...props}
      />
    )
  );
  TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
  
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none',
      'data-[state=active]:animate-tab-in',
      'data-[state=inactive]:animate-tab-out',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }