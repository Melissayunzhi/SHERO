let video, canvas, ctx, model, predictions = [];

async function init() {
    video = document.getElementById('webcam');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    video.width = 640;
    video.height = 480;
    canvas.width = 640;
    canvas.height = 480;

    // Load the Handpose model
    model = await handpose.load();
    console.log("Handpose model loaded");

    // Start video stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            detectHand();
        });
}

async function detectHand() {
    predictions = await model.estimateHands(video);
    drawHand(predictions);

    // Gesture recognition logic
    if (predictions.length > 0) {
        const GE = new fp.GestureEstimator([
            fp.Gestures.VictoryGesture, // Add other gestures as needed
        ]);
        const estimatedGestures = GE.estimate(predictions[0].landmarks, 8.5);
        if (estimatedGestures.gestures.length > 0) {
            // Check for victory gesture
            if (estimatedGestures.gestures[0].name === 'victory') {
                console.log('Victory gesture detected!');
                // Trigger video or action here
            }
        }
    }

    requestAnimationFrame(detectHand);
}

function drawHand(predictions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw hand keypoints and connections
    // ...
}

init();
function setupWebcam() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoElement.srcObject = stream;
            })
            .catch(function(err) {
                console.error("Error accessing the webcam: ", err);
                // Handle the error here. For example, show an alert or a placeholder image.
            });
    } else {
        console.error("getUserMedia not supported by this browser.");
    }
}
