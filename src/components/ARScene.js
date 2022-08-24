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
import { CameraRejected } from '~/components/CameraRejected';
import { UnknownError } from '~/components/UnknownError';

const ARScene = ({
  ...props
}) => {
  const [ haveUnknownError, setHaveUnknownError ] = useState(false);

  // Check camera access
  const [ cameraAccessIsLoaded, setCameraAccessIsLoaded ] = useState(false);
  const [ haveCameraAccess, setHaveCameraAccess ] = useState(false);
  useEffect(() => {
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
      setHaveUnknownError(true);
      return;
    });
  }, []);

  // Enable AR.js
  const [ arjsIsEnabled, setARjsIsEnabled ] = useState(false);
  const [ cameraAccessIsRejected, setCameraAccessIsRejected ] = useState(false);
  const enableARjs = useMemo(() => {
    return () => {
      if(
        !cameraAccessIsLoaded
        || arjsIsEnabled
      ) return;

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
        for(const tracks of stream.getTracks()) {
          tracks.stop();
        }
        setHaveCameraAccess(true);
        setARjsIsEnabled(true);
      }).catch(err => {
        switch(err.name) {
          case 'NotAllowedError': {
            setCameraAccessIsRejected(true);
            break;
          }
          default: {
            setHaveUnknownError(true);
            break;
          }
        }
        return;
      });
    };
  }, [
    cameraAccessIsLoaded,
    arjsIsEnabled,
  ]);

  useEffect(() => {
    if(
      cameraAccessIsLoaded
      && !arjsIsEnabled
      && haveCameraAccess
    ) {
      enableARjs();
    }
  }, [
    cameraAccessIsLoaded,
    haveCameraAccess,
    arjsIsEnabled,
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

      <CameraRejected
        open={
          cameraAccessIsLoaded
          && !haveCameraAccess
          && cameraAccessIsRejected
        }
      />

      <UnknownError
        open={
          cameraAccessIsLoaded
          && haveUnknownError
        }
      />
    </>
  );
};

export {
  ARScene,
};

