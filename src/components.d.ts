import { Stories, Story } from './core/components'

// Register components globally
// From https://github.com/vuejs/language-tools/blob/c290251387175be85b1d16bc6783c9712e49700a/packages/vscode-vue/README.md?plain=1#L84-L103
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Stories: typeof Stories
    Story: typeof Story
  }
}
