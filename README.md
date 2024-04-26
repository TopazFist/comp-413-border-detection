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
├── backend
│   ├── border-detection
│   │   ├── border_detection.py
│   │   ├── point_selector.py
│   │   └── run.py
│   ├── classification
│   │   ├── model.pth
│   │   ├── model.py # The process run by the backend
│   │   └── test_model.py
│   ├── config.js
│   ├── controllers
│   │   ├── authNurseController.js
│   │   ├── authPatientController.js
│   │   ├── authPhysicianController.js
│   │   ├── imageController.js
│   │   ├── nurseController.js
│   │   ├── patientController.js
│   │   └── physicianController.js
│   ├── index.js
│   ├── models
│   │   ├── ImageProcessing.js
│   │   ├── PatientImageModel.js
│   │   ├── nurseAuthModel.js
│   │   ├── nurseModel.js
│   │   ├── patientAuthModel.js
│   │   ├── patientModel.js
│   │   ├── physicianAuthModel.js
│   │   └── physicianModel.js
│   ├── package-lock.json
│   ├── package.json
│   └── routes
│       ├── auth.js
│       ├── images.js
│       ├── nurses.js
│       ├── patients.js
│       ├── physicians.js
│       └── upload.js
├── border_detection
│   ├── README.md
│   ├── border_detection.py
│   ├── evaluation.py
│   ├── point_selector.py
│   ├── run.py
│   ├── test_border_detection.py
├── frontend
│   ├── README.md
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── SourceImage.jsx
│   │   │   ├── api.jsx
│   │   │   ├── dermascope_logo.svg
│   │   │   ├── full_logo.svg
│   │   │   └── navbar.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── AddPatientFromNurse.jsx
│   │   │   ├── CreateNurse.jsx
│   │   │   ├── CreatePatientFromPhysician.jsx
│   │   │   ├── CreatePhysician.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── Login.css
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── NurseHome.jsx
│   │   │   ├── NurseViewPatient.jsx
│   │   │   ├── PatientHome.css
│   │   │   ├── PatientHome.jsx
│   │   │   ├── PatientProfile.jsx
│   │   │   ├── PhysicianHome.jsx
│   │   │   ├── PhysicianProfile.jsx
│   │   │   ├── Register.css
│   │   │   ├── Register.jsx
│   │   │   ├── Unauthorized.jsx
│   │   │   ├── ViewPatient.jsx
│   │   │   ├── Welcome.css
│   │   │   ├── Welcome.jsx
│   │   │   ├── loginNurse.jsx
│   │   │   └── loginPhysician.jsx
│   │   └── styles/ # All CSS files for the frontend
│   │       ├── imageUpload.css
│   │       └── styles.css
├── index.html
├── model_training/
│   └── Classification.ipynb
├── package-lock.json
├── package.json
└── requirements.txt
```