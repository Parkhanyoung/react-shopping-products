import { CART_API_URL } from "./../../envVariables";
import { renderHook, waitFor } from "@testing-library/react";
import useProducts from ".";
import { server } from "../../mocks/server";
import { HttpResponse, http } from "msw";
import { API_URL } from "../../constants/url";
import { act } from "@testing-library/react";

describe("useProducts", () => {
  describe("상품 목록 조회", () => {
    it("초기 상품 목록을 불러온다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products.length > 0).toBe(true);
      });
    });

    it("초기 상품 목록을 불러올 때 로딩 상태여야 한다", () => {
      const { result } = renderHook(() => useProducts());

      expect(result.current.loading).toBe(true);
    });

    it("초기 상품 목록을 불러올 때 에러가 발생하면 에러 객체를 받아온다", async () => {
      server.use(
        http.get(CART_API_URL + "/" + API_URL.products, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toEqual([]);
        expect(result.current.error).toBeTruthy();
        expect(result.current.loading).toBe(false);
      });
    });
  });
  describe("페이지네이션", () => {
    it("첫 페이지의 경우 상품 20개를 불러온다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toHaveLength(20);
      });
    });

    it("두 번째 페이지부터는 상품 4개를 불러온다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toHaveLength(20);
      });

      act(() => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(24);
      });
    });

    it("존재하는 모든 상품을 불러오면 더 이상 요청을 보내지 않는다", async () => {
      const FIRST_PAGE = 1;
      const LAST_PAGE = 20;
      const PAGE_SIZE = 4;
      const INITIAL_PAGE_SIZE = 20;

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.products).toHaveLength(20);
      });

      // NOTE : 마지막 페이지에 도달하기 위한 for문
      for (let currentPage = FIRST_PAGE; currentPage <= LAST_PAGE; currentPage++) {
        await waitFor(() => {
          act(() => {
            result.current.fetchNextPage();
          });
        });

        const expectedLength = INITIAL_PAGE_SIZE + currentPage * PAGE_SIZE;

        await waitFor(() => {
          expect(result.current.products).toHaveLength(expectedLength);
        });
      }

      await act(async () => {
        result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.products).toHaveLength(100);
      });
    });

    it("추가 상품을 불러올 때 로딩 상태를 표시한다", async () => {
      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.fetchNextPage();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("상품 필터링", () => {
    it("카테고리 필터를 적용할 경우, 해당 카테고리의 상품만 볼러온다", async () => {
      const CATEGORY = "fashion";

      const { result } = renderHook(() => useProducts());

      act(() => {
        result.current.setCategoryFilter(CATEGORY);
      });

      await waitFor(() => {
        expect(result.current.products.every((product) => product.category === CATEGORY)).toBe(
          true
        );
      });
    });
  });

  describe("상품 정렬", () => {
    it("선택한 가격 정렬 기준에 따라 상품을 불러온다", async () => {
      const PRICE_SORT = "desc";
      const { result } = renderHook(() => useProducts());

      act(() => {
        result.current.setPriceSort(PRICE_SORT);
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      const sortedProducts = result.current.products.slice().sort((a, b) => b.price - a.price);

      await waitFor(() => {
        expect(result.current.products).toEqual(sortedProducts);
      });
    });
  });
});
