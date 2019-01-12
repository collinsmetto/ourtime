import React from 'react';

const PlusButton = ({stateCal, getEvents}) => {
  var test = ["********"]
  return(
    <button onClick={() => getEvents(stateCal = test)}>+</button>
    //stateCal = test
  )
};

export default PlusButton;