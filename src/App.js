import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import './App.css';

// const useHackerNewsApi = () => {
//   const [data, setData] = useState({ hits: [] });
//   const [url, setUrl] = useState('http://hn.algolia.com/api/v1/search?query=');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     (async function fetchData() {
//       setIsError(false);
//       setIsLoading(true);

//       try {
//         const result = await axios(url);
//         setData(result.data);
//       } catch (error) {
//         setIsError(true);
//       }

//       setIsLoading(false);
//     })();
//     console.log('useEffect()');
//   }, [url]);

//   return [{ data, isLoading, isError }, setUrl];
// };

// --> Custom Hook 인 useHackerNewsApi 를 Generig 으로 표현한다

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    (async function fetchData() {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    })();
    console.log('useEffect()');
  }, [url]);
  console.log(state);
  return [state, setUrl];
};

export default function App() {
  const [query, setQuery] = useState('');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    'https://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] }
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
        }}
      >
        {' '}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type search keyword"
        />{' '}
        <button type="button">Search</button>
        {isError && <div>Something went wrong...</div>}
        {isLoading ? (
          <div>Loading.....</div>
        ) : (
          <ul>
            {data.hits.map((item) => {
              return (
                <li key={item.objectID}>
                  <a href={item.url}>{item.title}</a>
                </li>
              );
            })}
          </ul>
        )}
      </form>
    </>
  );
}
