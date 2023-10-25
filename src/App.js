import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
import axios from "axios";

const api = (page) => {
  return axios.get(`https://openlibrary.org/search.json?q=${0}&page=${page}`);
};
export default function App() {
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const loadMore = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await api(page);
      setResults((data) => [...data, ...response.data.docs]);
    };
    if (page > 0) fetch();
  }, [page]);

  const handleIntersection = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const options = {
      root: null
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    if (loadMore.current) {
      observer.observe(loadMore.current);
    }
    return () => {
      if (loadMore.current) observer.unobserve(loadMore.current);
    };
  }, []);

  return (
    <div className="App">
      <div>Infinte list</div>
      {results.map((item, index) => {
        return <div key={index}>{item.title}</div>;
      })}
      <div ref={loadMore} />
    </div>
  );
}
