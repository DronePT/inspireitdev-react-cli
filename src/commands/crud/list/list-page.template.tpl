import { Link } from 'react-router-dom';

import { useList{{upperEntityPlural}} } from '../../hooks';

export const List{{upperEntityPlural}}Page = (): JSX.Element => {
  const { {{lowerEntityPlural}} } = useList{{upperEntityPlural}}();

  return (
    <div>
      <h1>{{upperEntityPlural}} list</h1>
      <ul>
        {{curly lowerEntityPlural "left"}}.map(({{lowerEntity}}) => (
          <li key={`list-user-${{curly lowerEntity "left"}}.getId()}`} className="p-4">
            <Link
              className="inline-flex px-4 py-2 m-4 bg-white rounded-lg shadow-lg"
              to={`/{{lowerEntityPlural}}/${{curly lowerEntity "left"}}.getId()}`}
            >
              Navigate to {{curly lowerEntity "left"}}.getId()}
            </Link>
            <pre className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
              {JSON.stringify({{lowerEntity}}, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
};
