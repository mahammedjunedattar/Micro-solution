// components/ui/accordion.jsx
import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { cva } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'
const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-gray-200', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const accordionTriggerVariants = cva(
  'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg:rotate-180',
  {
    variants: {
      variant: {
        default: 'text-gray-900 hover:text-indigo-600',
        filled: 'bg-gray-50 px-4 rounded-lg hover:bg-gray-100'
      }
    },
    defaultVariant: 'default'
  }
)

const AccordionTrigger = React.forwardRef(
  ({ className, children, variant, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerVariants({ variant, className }))}
        {...props}
      >
        {children}
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }