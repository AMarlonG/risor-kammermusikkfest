import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'spillested',
  title: 'Spillested',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bilde',
      title: 'Bilde',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternativ tekst',
          description: 'Viktig for SEO og tilgjengelighet.',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return 'Required';
              }
              return true;
            });
          },
        },
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
