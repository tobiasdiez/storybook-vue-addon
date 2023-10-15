import type StoryVue from './story.vue'
import type StoriesVue from './stories.vue'

/**
 * Story that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/vue/api/csf#named-story-exports)
 */
export const Story = {} as typeof StoryVue

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/vue/api/csf#default-export)
 */
export const Stories = {} as typeof StoriesVue

// Due to a TypeScript bug (https://github.com/microsoft/TypeScript/issues/47663), we need to export types from dependencies
export type { StoryObj } from '@storybook/vue3'
export type { ArgTypes, Args, Parameters, StrictArgs } from '@storybook/types'
export type {
  Simplify,
  SetOptional,
  Constructor,
  RemoveIndexSignature,
} from 'type-fest'
