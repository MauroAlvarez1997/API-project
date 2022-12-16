import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotDetails from "./components/SpotDetails";
import { Route } from "react-router-dom";
import CreateSpot from "./components/CreateSpot";
import UpdateSpot from "./components/UpdateSpot";
import UserReviews from "./components/UserReviews";
import CreateReview from "./components/CreateReview";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <AllSpots />
          </Route>
          <Route exact path={'/spots/new'}>
            <CreateSpot />
          </Route>
          <Route exact path={'/spots/:spotId/update'}>
            <UpdateSpot />
          </Route>
          <Route exact path={'/spots/:spotId'}>
            <SpotDetails/>
          </Route>
          <Route exact path={'/reviews/my-reviews'}>
            <UserReviews/>
          </Route>
          <Route exact path={'/reviews/:spotId/create'}>
            <CreateReview />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
