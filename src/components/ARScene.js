import {
  useState,
} from 'react';
import 'aframe';
import {
  Scene,
  Entity,
} from 'aframe-react';

const ARScene = ({
  ...props
}) => {
  return (
    <Scene
    >
      <Entity
        geometry={{
          primitive: 'box',
        }}
        material={{
          color: 'red',
        }}
        position={{
          x: 0,
          y: 0,
          z: -5,
        }}
      />
    </Scene>
  );
};

export {
  ARScene,
};

