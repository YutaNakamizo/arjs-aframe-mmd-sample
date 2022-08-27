import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { CameraConfirm } from '~/components/CameraConfirm';
import { CameraRejected } from '~/components/CameraRejected';
import { UnknownError } from '~/components/UnknownError';

const ARScene = ({
  elements = [],
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
    enableARjs,
  ]);

  // Setup scene
  const sceneElmRef = useRef();
  const ambientLightElmRef = useRef();
  const markerElmRef = useRef();
  const cameraElmRef = useRef();
  const [ arSceneIsReady, setARSceneIsReady ] = useState(false);
  useEffect(() => {
    if(!arjsIsEnabled) return;

    const scene = sceneElmRef.current = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('arjs', '');
    scene.setAttribute('vr-mode-ui', 'enabled: false;');

    const ambientLight = ambientLightElmRef.current = document.createElement('a-entity');
    ambientLight.setAttribute('light', 'type:ambient; color:#ffffff; intensity:0.6;');
    scene.appendChild(ambientLight);

    const marker = markerElmRef.current = document.createElement('a-marker');
    marker.setAttribute('type', 'pattern');
    marker.setAttribute('preset', 'hiro');
    marker.setAttribute('emitevents', true);

    marker.addEventListener('markerFound', () => {
      console.log('Marker Found');
    });
    marker.addEventListener('markerLost', () => {
      console.log('Marker Lost');
    });
    scene.appendChild(marker);

    const camera = cameraElmRef.current = document.createElement('a-entity');
    camera.setAttribute('camera', '');
    scene.appendChild(camera);

    document.body.appendChild(scene);

    setARSceneIsReady(true);

    return () => {
      sceneElmRef.current.remove();
      sceneElmRef.current = null;
      markerElmRef.current = null;
      cameraElmRef.current = null;

      setARSceneIsReady(false);
    };
  }, [
    arjsIsEnabled,
  ]);

  // Setup elements in a-marker
  useEffect(() => {
    if(
      !arSceneIsReady
      || !markerElmRef.current
    ) return;

    const markerGroup = markerElmRef.current.object3D;
    markerGroup.clear();
    console.log(markerGroup)
    for(const elm of elements) {
      const {
        object,
        audioListener,
      } = elm;

      if(object) markerGroup.add(object);
      if(audioListener) markerGroup.add(audioListener);
    }

    return;
  }, [
    arSceneIsReady,
    elements,
  ]);

  return (
    <>
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

