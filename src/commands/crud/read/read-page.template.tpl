import { useGet{{upperEntity}} } from '../../hooks';

export const View{{upperEntity}}Page = (): JSX.Element => {
  const { id, {{lowerEntity}} } = useGet{{upperEntity}}();

  return (
    <div>
      <h1>Viewing {{lowerEntity}} (id: {id})</h1>
      <pre>{JSON.stringify({{lowerEntity}}, null, 2)}</pre>
    </div>
  );
};
