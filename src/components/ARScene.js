import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import '@ar-js-org/ar.js';
import 'aframe';
import {
  Scene,
} from 'aframe-react';
import { CameraConfirm } from '~/components/CameraConfirm';

const ARScene = ({
  ...props
}) => {
  // Check camera access
  const [ cameraAccessIsLoaded, setCameraAccessIsLoaded ] = useState(false);
  const [ haveCameraAccess, setHaveCameraAccess ] = useState(false);
  useEffect(() => {
    const userMediaConstraints = {
      audio: false,
      video: {
        facingMode: "environment",
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
    };

    navigator.mediaDevices.enumerateDevices().then(devices => {
      for(const device of devices) {
        if(
          device.kind === 'videoinput'
          && device.label !== ""
        ) {
          setHaveCameraAccess(true);
          break;
        }
      }

      setCameraAccessIsLoaded(true);
      return;
    }).catch(err => {
      console.error(err);
    });
  }, []);

  // Enable AR.js
  const [ arjsIsEnabled, setARjsIsEnabled ] = useState(false);
  const enableARjs = useMemo(() => {
    return () => {
      if(!cameraAccessIsLoaded) return;

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment",
          width: {
            ideal: 640,
          },
          height: {
            ideal: 480,
          },
        },
      }).then(stream => {
        setHaveCameraAccess(true);
        setARjsIsEnabled(true);
      }).catch(err => {
        console.error(err);
      });
    };
  }, [
    cameraAccessIsLoaded,
  ]);

  return (
    <>
      {arjsIsEnabled && (
        <Scene
          vr-mode-ui={{
            enabled: false,
          }}
          arjs={`
          `}
        >
        </Scene>
      )}

      <CameraConfirm
        open={
          cameraAccessIsLoaded
          && !haveCameraAccess
        }
        onClickOk={e => {
          enableARjs();
        }}
      />
    </>
  );
};

export {
  ARScene,
};

