import styled from "styled-components";
import { ReactComponent as AddToCartIcon } from "../assets/addToCart.svg";
import { ReactComponent as DeleteFromCartIcon } from "../assets/deleteFromCart.svg";
import { addCartItem, deleteCartItem } from "../api/cartItems";
import { useContext } from "react";
import CartItemsContext from "../store/cartItems";
import { MAX_CART_ITEM_COUNT } from "../constants/cartItems";

interface ProductItemProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductItem = ({ id, name, price, imageUrl }: ProductItemProps) => {
  const { cartItems, refetch: refetchCartItems } = useContext(CartItemsContext);

  const handleAddToCart = async () => {
    try {
      if (cartItems.length < MAX_CART_ITEM_COUNT) {
        await addCartItem(id, 1);
        await refetchCartItems();
      } else {
        alert("장바구니에 담을 수 있는 상품의 개수는 20개까지입니다.");
      }
    } catch {
      alert("상품을 장바구니에 담는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요,");
    }
  };

  const targetCartItemId = cartItems.find((cartItem) => cartItem.product.id === id)?.id;
  const handleDeleteFromCart = async () => {
    try {
      if (targetCartItemId) {
        await deleteCartItem(targetCartItemId);
        await refetchCartItems();
      } else {
        alert("해당 상품이 장바구니에 없습니다.");
      }
    } catch {
      alert("상품을 장바구니에서 빼는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <S.Container>
      <S.ProductImage src={imageUrl}></S.ProductImage>
      <S.ProductInfo>
        <S.ProductName>{name}</S.ProductName>
        <S.ProductPrice>{price.toLocaleString()}원</S.ProductPrice>
      </S.ProductInfo>
      <S.ButtonWrapper>
        {targetCartItemId ? (
          <S.DeleteFromCartIcon
            role="button"
            aria-label="상품 빼기"
            onClick={handleDeleteFromCart}
          />
        ) : (
          <S.AddToCartIcon role="button" aria-label="상품 담기" onClick={handleAddToCart} />
        )}
      </S.ButtonWrapper>
    </S.Container>
  );
};

export default ProductItem;

const S = {
  Container: styled.article`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 48%;
  `,

  ProductImage: styled.img`
    width: 100%;
    height: 11rem;
    object-fit: cover;
    border-radius: 1.2rem 1.2rem 0 0;
  `,

  ProductInfo: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1.5rem 0.8rem;
  `,

  ProductName: styled.h3`
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
  `,

  ProductPrice: styled.p`
    font-size: 1.2rem;
  `,

  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-top: 0.8rem;
    width: 100%;
    right: 0;
  `,

  AddToCartIcon: styled(AddToCartIcon)`
    cursor: pointer;
  `,

  DeleteFromCartIcon: styled(DeleteFromCartIcon)`
    cursor: pointer;
  `,
};
