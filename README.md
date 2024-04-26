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

## Border Detection Information
[a relative link](border_detection/README.md)

## Classification Model Information
