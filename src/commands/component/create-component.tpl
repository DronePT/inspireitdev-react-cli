{{#if styles}}
import './{{component}}.css';

{{/if}}
interface {{component}}Props {
  children?: React.ReactNode;
}

export const {{component}} = (props: {{component}}Props): JSX.Element => (
  <div{{#if styles}} className="{{component}}"{{/if}}>{{component}}</div>
);
