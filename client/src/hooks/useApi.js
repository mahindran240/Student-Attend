import { useEffect, useState } from "react";

export default function useApi(request, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    request()
      .then((result) => {
        if (active) setData(result.data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // The caller owns the refresh contract for this generic request hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, setData };
}
