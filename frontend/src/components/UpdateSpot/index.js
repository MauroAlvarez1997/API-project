import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpot } from '../../store/spots';

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const specificSpot = useSelector(state => state.spots.singleSpot);

  const [address, setAddress] = useState(specificSpot.address);
  const [city, setCity] = useState(specificSpot.city);
  const [state, setState] = useState(specificSpot.state);
  const [country, setCountry] = useState(specificSpot.country);
  const [name, setName] = useState(specificSpot.name);
  const [description, setDescription] = useState(specificSpot.description);
  const [price, setPrice] = useState(specificSpot.price);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSpot = {
      id: specificSpot.id,
      address,
      city,
      state,
      country,
      lat: 100,
      lng: 100,
      name,
      description,
      price,
    };

    setErrors([]);
    return dispatch(updateSpot(newSpot, newSpot.id))
    .catch(async (res) => {
      const data = await res.json();
      console.log(data)
      if(data && data.errors) setErrors(data.errors);
      if(data && data.message) setErrors([data.message]);
    });
  };

  return specificSpot && (
    <>
      <h1>Update Spot form</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Spot</button>
      </form>
    </>
  )
}

export default UpdateSpot;
