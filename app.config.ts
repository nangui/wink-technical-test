export default defineAppConfig({
  ui: {
    colors: {
      primary: '#0072FF',
      gray: 'slate',
    },
    card: {
      slots: {
        root: 'rounded-lg overflow-hidden',
        header: 'p-4 sm:px-6 border-0',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6'
      },
      variants: {
        variant: {
          solid: {
            root: 'bg-inverted text-inverted'
          },
          outline: {
            root: 'bg-default ring ring-default'
          },
          soft: {
            root: 'bg-elevated/50'
          },
          subtle: {
            root: 'bg-elevated/50 ring ring-default'
          }
        }
      },
      defaultVariants: {
        variant: 'outline'
      }
    },
    stepper: {
      variants: {
        color: {
          primary: {
            trigger: 'group-data-[state=completed]:bg-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-white [state=active]:text-white focus-visible:outline-primary bg-[#F9FAFB]',
            separator: 'group-data-[state=completed]:bg-primary'
          }
        }
      },
    }
  },
})
