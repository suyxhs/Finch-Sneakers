import React from "react";
import ContentLoader from "react-content-loader";
import AppContext from "../../context";
import cardStyles from "./Card.module.scss";

function Card({
  id,
  title,
  imageUrl,
  price,
  addLike,
  addBasket,
  liked = false,
  loading = false,
}) {
  const { isItemAdded } = React.useContext(AppContext);
  const [isLike, setIsLike] = React.useState(liked);
  const itemObj = { id, parentId: id, title, imageUrl, price }

  const onClickPlus = () => {
    addBasket( itemObj );
  };

  const onClickLiked = () => {
    addLike( itemObj );
    setIsLike(!isLike);
  };

  return (
    <div className={cardStyles.card}>
       {loading ? (
        <ContentLoader
          speed={2}
          width={155}
          height={250}
          viewBox="0 0 155 265"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb">
          <rect x="1" y="0" rx="10" ry="10" width="155" height="155" />
          <rect x="0" y="167" rx="5" ry="5" width="155" height="15" />
          <rect x="0" y="187" rx="5" ry="5" width="100" height="15" />
          <rect x="1" y="234" rx="5" ry="5" width="80" height="25" />
          <rect x="124" y="230" rx="10" ry="10" width="32" height="32" />
        </ContentLoader>
      ) : (
        <>
          {addLike && <div className={cardStyles.favorite} onClick={onClickLiked}>
            <img
              src={isLike ? "/img/heart-liked.svg" : "/img/heart-unliked.svg"}
              alt="Unliked"
            />
          </div>}
          <img width='100%' height={135} src={imageUrl} alt="sneakers" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price} руб.</b>
            </div>
            {addBasket && <img
              className={cardStyles.plus}
              onClick={onClickPlus}
              src={isItemAdded(id) ? "/img/btn-checked.svg" : "/img/btn-plus.svg"}
              alt="plus"
            />}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
