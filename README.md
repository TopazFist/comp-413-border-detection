# comp-413-border-detection

## Getting Started
Install the Python packages using the requirements.txt in the repo's root directory
```
pip install -r requirements.txt
```

Ensure that you have Nodejs installed: https://nodejs.org/en/download

Install the backend npm packages
```
cd backend
npm install
cd ..
```

Install the frontend npm packages
```
cd frontend
npm install
cd ..
```

Start the frontend
```
cd frontend
npm run dev
```

Start the backend
```
cd backend
npm run dev
```

Assuming your ports do not have any unique setup, the website should be accessed by going to http://localhost:5173/ in your browser. The backend API should be running at http://localhost:3001/ and if it is running at a different endpoint, the `baseUrl` property should be changed in the `api` and `fileApi` objects in `frontend/components/api.jsx`.

## Repository Structure
```
├── README.md
├── backend/ # All code for the backend API
│   ├── border-detection/ # All code for the border detection algorithm
│   │   ├── border_detection.py
│   │   ├── point_selector.py
│   │   └── run.py # The process run by the backend for border detection processing
│   ├── classification/
│   │   ├── model.pth # Parameters for the trained model
│   │   ├── model.py # The process run by the backend
│   │   └── test_model.py # Tests for the model process
│   ├── controllers/ # Code that is called by the router and interacts with DB models
│   ├── index.js # The main script run that starts express JS
│   ├── models/ # Database models that interact with MongoDB
│   ├── package-lock.json # Backend package information
│   ├── package.json # Backend package information
│   └── routes/ # Code that routes appropriate URLs to controller functions
├── border_detection/ # Border detection benchmarking and testing
├── frontend/ # All code for the frontend scripts
│   ├── index.html # The react landing page, running App.js and all other scripts
│   ├── package-lock.json # All frontend package information
│   ├── package.json # All frontend package information
│   ├── src/
│   │   ├── App.jsx # Loads pages, navbar, and everything needed for the client
│   │   ├── components/ # Components rendered by pages and App.jsx
│   │   ├── index.css # Tailwind css Styling
│   │   ├── main.jsx # The main react javascript program that loads App.jsx
│   │   ├── pages/ # All pages for all possible user states
│   │   └── styles/ # All non-tailwind or MaterialUI styling for the frontend
├── model_training/
│   └── Classification.ipynb # Notebook used to train the fine-tuned model#
└── requirements.txt # Python required packages
```

## Frontend Information

## Backend Information

## Classification Model Information
The classification model takes in skin lesion images and makes a prediction as to whether or not the lesion is malignant. 

### Training Procedure
The training notebook is at [a relative link](model_training/Classification.ipynb).

We loaded a ResNet-18 residual convolutional neural network model pre-trained on around 1.2 million images to categorize 1000 different categories on the Imagenet-1k dataset. We then replaced the final fully connected layer with one with the same number of input features (512) but with only 2 output features representing malignant and benign logits.

We then fine-tuned the model with the SGD optimizer for 12 epochs at a learning rate of 1.5 x 10^-3 learning rate with a 10^-3 weight decay parameter to prevent overfitting. The training data was 5,233 images and the validation date was 1,745 images. The data went through random rotation and reflection augmentations to increase data variety and further prevent overfitting.

The results showed a 93.5% validation accuracy and a 92.9% training accuracy, showing absolutely no indication of overfitting. This model could be further trained to increase accuracy, but it couldn’t be done in our timeframe. State-of-the-art models achieve a 90-97% accuracy [a link](https://www.researchgate.net/publication/376048706_SkinLesNet_Classification_of_Skin_Lesions_Using_a_Multi-Layer_Deep_Convolutional_Neural_Network_in_Dermoscopy_Images "(source)") so this is very promising.

### Heatmap Information
In [a relative link](backend/classification/model.py), the program breaks apart the model and takes the features before the final fully connected layer to construct a heatmap. By taking the dot product of these features with the fully connected layer weights corresponding to the highest-probability prediction, we can understand what spatial areas of the input image have the highest or lowest impact on the prediction. This is meant to help physicians understand where the model is looking at the most in its prediction.

### Model Process Information
The website runs a Python process ([a relative link](backend/classification/model.py)) in the background that loads the model architecture and the model weights ([a relative link](backend/classification/model.pth)), and can make predictions when requested by the Express JS backend. It does this using stdin and stdout, where the Express JS backend will send a file path to the Python process via stdin, and the Python process will print a JSON with prediction results and the path to the regional heatmap for the backend to use. The process runs in a loop, so the backend can consistently supply the model process with file paths for predictions.

## Border Detection Information
[a relative link](border_detection/README.md)