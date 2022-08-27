import {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  AudioLoader,
  AudioListener,
  Audio,
  Clock,
} from 'three';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
import {
  Box,
  Paper,
  Button,
} from '@mui/material';
import { ARScene } from '~/components/ARScene';

//const appClock = new Clock();

const App = () => {
  const appClockRef = useRef(new Clock());

  // Control tick
  const [ tickStatus, setTickStatus ] = useState('stopped');
  const animationRequestIdRef = useRef(null);
  useEffect(() => {
    const startAnimation = () => {
      const update = () => {
        const delta = appClockRef.current.getDelta();
        for(const elm of arElements) {
          const {
            animationHelper,
          } = elm;

          if(animationHelper) animationHelper.update(delta);
        }

        animationRequestIdRef.current = window.requestAnimationFrame(update);
      };

      animationRequestIdRef.current = window.requestAnimationFrame(update);
    };
    const pauseAnimation = () => {
      const animationRequestId = animationRequestIdRef.current;
      if(animationRequestId) {
        window.cancelAnimationFrame(animationRequestId);
        animationRequestIdRef.current = null;
      }

      for(const elm of arElements) {
        const {
          animationHelper,
        } = elm;

        if(
          animationHelper
          && animationHelper.audio
        ) animationHelper.audio.pause();
      }
    };
    const stopAnimation = () => {
      const animationRequestId = animationRequestIdRef.current;
      if(animationRequestId) {
        window.cancelAnimationFrame(animationRequestId);
        animationRequestIdRef.current = null;
      }

      const elapsedTime = appClockRef.current.getElapsedTime();
      console.log(elapsedTime)
      for(const elm of arElements) {
        const {
          animationHelper,
        } = elm;

        if(animationHelper) {
          animationHelper.update(-elapsedTime);

          if(
            animationHelper.audio
            && animationHelper.audio.source
          ) {
            animationHelper.audio.stop();
          }
        }
      }
    };

    switch(tickStatus) {
      case 'started': {
        appClockRef.current.start();
        startAnimation();
        return pauseAnimation;
      }
      case 'paused': {
        appClockRef.current.stop();
        pauseAnimation();
        return;
      }
      case 'stopped': {
        appClockRef.current.stop();
        stopAnimation();
        appClockRef.current = new Clock();

        console.log(appClockRef.current)
        return;
      }
      default: {
        return;
      }
    }
  }, [
    tickStatus,
  ]);

  // Control AR elements
  const [ arElements, setARElements ] = useState([]);
  useEffect(() => {
    const mmdLoader = new MMDLoader();
    mmdLoader.loadWithAnimation(
      '/mmd/models/水菜月夏希/水菜月夏希.pmx',
      '/mmd/motions/disco_v3_401.vmd',
      mmd => { // onLoad
        const {
          mesh,
          animation,
        } = mmd;
        mesh.scale.set(.6, .6, .6);

        const mmdAnimationHelper = new MMDAnimationHelper({});
        mmdAnimationHelper.add(
          mesh,
          {
            animation,
            physics: true,
            unitStep: 1/42,
          }
        );

        new AudioLoader().load(
          '/music/太陽系デスコ_水菜月夏希.mp3',
          buffer => {
            const listener = new AudioListener();
            const audio = new Audio(listener).setBuffer(buffer);

            listener.position.z = 1;

            mmdAnimationHelper.add(
              audio,
              {
                delayTime: 0.5,
              }
            );

            setARElements([
              {
                object: mesh,
                audioListener: listener,
                animationHelper: mmdAnimationHelper,
              },
            ]);
          }
        );
      },
      xhr => { // onProgress
        console.log(
          ( xhr.loaded / xhr.total * 100 ) + '% loaded'
        );
      },
      err => { // onError
        console.error(err);
      },
    );
  }, []);

  return (
    <div className="App">
      <ARScene
        elements={arElements}
      />

      <Box
        sx={{
          position: 'fixed',
          bottom: t => t.spacing(1),
          left: t => t.spacing(1),
          zIndex: 9999,
        }}
      >
        <Paper
          sx={{
            padding: t => t.spacing(1),
          }}
        >
          <Button
            variant="text"
            onClick={e => {
              switch(tickStatus) {
                case 'started': {
                  setTickStatus('paused');
                  break;
                }
                case 'paused':
                case 'stopped': {
                  setTickStatus('started');
                  break;
                }
              }
            }}
          >
            {tickStatus === 'stopped' || tickStatus === 'paused' ? 'Start' : 'Pause'}
          </Button>
          <Button
            variant="text"
            onClick={e => {
              setTickStatus('stopped');
            }}
            disabled={
              tickStatus === 'stopped'
            }
          >
            Stop
          </Button>
        </Paper>
      </Box>
    </div>
  );
};

export {
  App,
};

