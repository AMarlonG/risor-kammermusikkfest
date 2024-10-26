import { DocumentTextIcon } from '@sanity/icons';
import { format, parseISO } from 'date-fns';
import { defineField, defineType } from 'sanity';

import spillestedType from './spillested';

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: 'arrangement',
  title: 'Arrangement',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'tittel',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'En slug er nødvendig for at arrangementet skal vises i forhåndsvisningen',
      options: {
        source: 'tittel',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'innhold',
      title: 'Innhold',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'undertittel',
      title: 'Undertittel',
      type: 'text',
    }),
    defineField({
      name: 'hovedbilde',
      title: 'Hovedbilde',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternativ tekst',
          description: 'Viktig for SEO og tilgjengelighet.',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Required';
              }
              return true;
            });
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dato',
      title: 'Dato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'spillested',
      title: 'Spillested',
      type: 'reference',
      to: [{ type: spillestedType.name }],
    }),
  ],
  preview: {
    select: {
      title: 'tittel',
      spillested: 'spillested.name',
      date: 'dato',
      media: 'hovedbilde',
    },
    prepare({ title, media, spillested, date }) {
      const subtitles = [
        spillested && `på ${spillested}`,
        date && `den ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(' ') };
    },
  },
});
