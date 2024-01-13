import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

let gestureRecognizer;
const videoHeight = "360px";
const videoWidth = "480px";

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO"
  });
  enableCam();
};

const enableCam = async () => {
  const constraints = { video: true };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const video = document.getElementById("webcam");
  video.srcObject = stream;
  video.addEventListener('loadeddata', predictWebcam);
};


const predictWebcam = async () => {
  const video = document.getElementById("webcam");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  const gestureOutput = document.getElementById("gesture_output");
  const stillImage = document.getElementById("stillImage");
  const animatedImage = document.getElementById("animatedImage");

  const results = await gestureRecognizer.recognizeForVideo(video, Date.now());
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.gestures.length > 0) {
      const categoryName = results.gestures[0][0].categoryName;
      const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);

      gestureOutput.innerText = `Gesture: ${categoryName}, Confidence: ${categoryScore}%`;
      gestureOutput.style.display = "block";

      if (categoryName === 'ILoveYou') { // Change the gesture name as per your requirement
        stillImage.style.display = 'none';
          animatedImage.style.display = 'block';
      } else {
          animatedImage.style.display = 'none';
          stillImage.style.display = 'block';
      }
  } else {
      gestureOutput.style.display = "none";
  }
  window.requestAnimationFrame(predictWebcam);
};

createGestureRecognizer();
