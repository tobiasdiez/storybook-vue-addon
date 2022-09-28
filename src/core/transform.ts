/**
 * Transforms a vue single-file-component into Storybook's Component Story Format (CSF).
 */
export function transform(_code: string) {
  return `
    import MyButton from './Button.vue';
    import { userEvent, within } from '@storybook/testing-library';
    import { expect } from '@storybook/jest';
    
    export default {
      title: 'Example/ButtonTest',
      component: MyButton,
      argTypes: {
        backgroundColor: { control: 'color' },
        size: {
          control: { type: 'select', options: ['small', 'medium', 'large'] },
        },
        onClick: {},
      },
    };
    
    const Template = (args) => ({
      components: { MyButton },
      setup() {
        return { args };
      },
      template: '<my-button v-bind="args" />',
    });
    
    export const Primary = Template.bind({});
    Primary.args = {
      primary: true,
      label: 'Button',
    };
    Primary.play = async ({ args, canvasElement }) => {
      const canvas = within(canvasElement);
      const button = canvas.getByRole('button');
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalled();
    };
    
    export const Secondary = Template.bind({});
    Secondary.args = {
      label: 'Button',
    };
    
    export const Large = Template.bind({});
    Large.args = {
      size: 'large',
      label: 'Button',
    };
    
    export const Small = Template.bind({});
    Small.args = {
      size: 'small',
      label: 'Button',
    };        
    `
}
