import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

export function useActions<T extends ActionCreatorsMapObject>(
  { actions, deps }: { actions: T; deps?: Array<any>; }): T {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      return bindActionCreators<T, T>(actions, dispatch);
    },  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps ? [dispatch, ...deps] : [dispatch]
  );
}
