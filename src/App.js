import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import AppContext from "./context";

import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [liked, setLiked] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, likedResponse, itemsResponse] = await Promise.all([
          axios.get("https://638cf2e2eafd555746b2d09e.mockapi.io/Cart"),
          axios.get("https://638cf2e2eafd555746b2d09e.mockapi.io/Liked"),
          axios.get("https://638cf2e2eafd555746b2d09e.mockapi.io/Items"),
        ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setLiked(likedResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Произошла ошибка, попробуйте перезапустить сервис");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id))
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://638cf2e2eafd555746b2d09e.mockapi.io/Cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const {data} = await axios.post(
          "https://638cf2e2eafd555746b2d09e.mockapi.io/Cart",
          obj
        );
        setCartItems((prev) => prev.map(item => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            };
          }
          return item;
        }));
      }
    } catch (error) {
      alert("Ошибка при добавлении в корзину");
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://638cf2e2eafd555746b2d09e.mockapi.io/Cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert("Ошибка при удалении товара из корзины");
      console.error(error);
    }
  };

  const onAddToLiked = async (obj) => {
    try {
      if (liked.find((liObj) => Number(liObj.id) === Number(obj.id))) {
        axios.delete(
          `https://638cf2e2eafd555746b2d09e.mockapi.io/Liked/${obj.id}`
        );
        setLiked((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          "https://638cf2e2eafd555746b2d09e.mockapi.io/Liked",
          obj
        );
        setLiked((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить в избранное");
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        liked,
        isItemAdded,
        onAddToLiked,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />
        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToLiked={onAddToLiked}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          />
          <Route path="/favorites" element={<Favorites />} />

          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
