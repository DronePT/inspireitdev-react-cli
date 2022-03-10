import { useList{{upperEntityPlural}} } from '../../hooks';

export const List{{upperEntityPlural}}Page = (): JSX.Element => {
  const { {{lowerEntityPlural}} } = useList{{upperEntityPlural}}();

  return (
    <div>
      <h1>{{upperEntityPlural}} list</h1>
      <pre>{JSON.stringify({{lowerEntityPlural}}, null, 2)}</pre>
    </div>
  );
};
