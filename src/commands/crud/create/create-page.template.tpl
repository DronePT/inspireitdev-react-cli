import { Create{{upperEntity}}Form } from '../../components';
import { useCreate{{upperEntity}} } from '../../hooks';

export const Create{{upperEntity}}Page = (): JSX.Element => {
  const { create } = useCreate{{upperEntity}}();

  return (
    <div>
      <h1>Create {{lowerEntity}}</h1>
      <Create{{upperEntity}}Form onSubmit={create}></Create{{upperEntity}}Form>
    </div>
  );
};
