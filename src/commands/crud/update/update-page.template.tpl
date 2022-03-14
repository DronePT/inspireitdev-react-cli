import { Update{{upperEntity}}Form } from '../../components';
import { useUpdate{{upperEntity}} } from '../../hooks';

export const Update{{upperEntity}}Page = (): JSX.Element => {
  const { id, {{lowerEntity}}, update } = useUpdate{{upperEntity}}();

  return (
    <div>
      <h1>Update {{lowerEntity}} (id: {id})</h1>
      <pre>{JSON.stringify({{lowerEntity}}, null, 2)}</pre>
      <Update{{upperEntity}}Form onSubmit={update}></Update{{upperEntity}}Form>
    </div>
  );
};
