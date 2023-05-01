type NonUndefinedable<T> = T extends undefined ? never : T
type TypePropsToRuntimeProps<T> = {
  [K in keyof T]-?: {} extends Pick<T, K>
    ? {
        type: import('vue').PropType<NonUndefinedable<T[K]>>
      }
    : {
        type: import('vue').PropType<T[K]>
        required: true
      }
}
type VueComponent<Props> = import('vue').DefineComponent<
  TypePropsToRuntimeProps<Props>,
  {},
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {},
  string,
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<import('vue').ExtractPropTypes<TypePropsToRuntimeProps<Props>>> & {},
  {}
>

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/vue/api/csf#default-export)
 */
interface StoriesProps {
  /**
   * Title of the component which will be presented in the navigation. **Should be unique.**
   *
   * Components can be organized in a nested structure using "/" as a separator.
   *
   * @see [Naming components and hierarchy](https://storybook.js.org/docs/vue/writing-stories/naming-components-and-hierarchy)
   */
  title?: string
  /**
   * The primary component for your story.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   */
  component?: import('vue').DefineComponent
}
type Stories = VueComponent<StoriesProps>

import { Meta, StoryObj } from '@storybook/vue3'

/**
 * Story that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/vue/api/csf#named-story-exports)
 */
interface StoryProps {
  /**
   * Display name in the UI.
   */
  title: string
  /**
   * Function that is executed after the story is rendered.
   *
   * Must be defined in a non-setup script
   */
  play?: StoryObj<Meta<VueComponent<any>>>['play']
}
type Story = VueComponent<StoryProps>

// Register components globally
// From https://github.com/vuejs/language-tools/blob/c290251387175be85b1d16bc6783c9712e49700a/packages/vscode-vue/README.md?plain=1#L84-L103
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Stories: Stories
    Story: Story
  }
}

export {}
