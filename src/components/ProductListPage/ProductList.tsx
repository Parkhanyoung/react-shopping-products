import { useEffect } from "react";
import styled from "styled-components";

import ProductItem from "@components/ProductListPage/ProductItem";
import ShopHeader from "@components/ProductListPage/ShopHeader";
import ProductFilterBar from "@components/ProductListPage/ProductFilterBar";
import LoadingSpinner from "@components/common/LoadingSpinner";
import { IntersectionDetector } from "@components/common/IntersectionDetector";

import { useInfiniteProducts } from "@hooks/useInfiniteProducts";
import { useErrorToast } from "@contexts/errorToast/useErrorToast";

const ProductList = () => {
  const { products, isLoading, error, fetchNextPage, updateCategoryFilter, updatePriceSort } =
    useInfiniteProducts();
  const { showErrorToast } = useErrorToast();

  useEffect(() => {
    if (error) {
      showErrorToast("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [error]);

  return (
    <>
      <S.Container>
        <ShopHeader />
        <S.ShopBody>
          <S.Title>bpple 상품 목록</S.Title>
          <ProductFilterBar
            updateCategoryFilter={updateCategoryFilter}
            updatePriceSort={updatePriceSort}
          />
          <S.ItemContainer>
            {products.map((product) => (
              <ProductItem
                key={crypto.randomUUID()}
                productInfo={product}
                showErrorToast={showErrorToast}
              />
            ))}
            {isLoading && <LoadingSpinner />}
            <IntersectionDetector onIntersected={fetchNextPage} />
          </S.ItemContainer>
        </S.ShopBody>
      </S.Container>
    </>
  );
};

export default ProductList;

const S = {
  Container: styled.main`
    display: flex;
    flex-direction: column;
    margin-top: 10.4rem;
  `,

  ShopBody: styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 0 2rem;
  `,

  Title: styled.h2`
    font-size: 2.4rem;
    font-weight: bold;
  `,

  ItemContainer: styled.section`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1 0 100%;
    gap: 2.6rem 1.6rem;
    margin-top: 1.1rem;
  `,
};
