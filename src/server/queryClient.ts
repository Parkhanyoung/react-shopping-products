import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./__constants__/queryKeys";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export const queryInvalidator = {
  cartItems: () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cartItems] });
  },
};
