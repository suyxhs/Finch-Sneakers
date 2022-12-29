import React from "react";
import Card from "../components/Card";
import AppContext from "../context";

function Favorites() {
  const { liked, onAddToLiked } = React.useContext(AppContext);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Избранные товары</h1>
      </div>

      <div className="d-flex flex-wrap">
        {liked.map((item, index) => (
          <Card key={index} liked={true} addLike={onAddToLiked} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
