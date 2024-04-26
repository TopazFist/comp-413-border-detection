import React from 'react'
import { useState } from 'react';

const SourceImage = (props) => {
    const { patientImage, handlePhysicianNotesChange } = props;
    const [heatmap, setHeatmap] = useState(false);

    return (
        <div onMouseEnter={() => setHeatmap(true)} onMouseLeave={ () => setHeatmap(false)}>
            <img
                className="image"
                src={(heatmap && patientImage.heatmapPath) ? "http://localhost:3001/" + patientImage.heatmapPath : "http://localhost:3001/" + patientImage.s3image}
                alt={patientImage.s3image}
              />
              <div className="benign-status">
                <p className={`benign-text ${patientImage.isBenign ? 'benign-true' : 'benign-false'}`}>
                  Benign: {patientImage.isBenign ? 'True' : 'False'}
                </p>
                <p className="probability-text">
                  Benign Probability: {Math.round(patientImage.benignProbability * 100)}%
                </p>
              </div>
              <label className="notes-label">
                <input
                  type="text"
                  value={patientImage.physicianNotes}
                  onChange={(e) => handlePhysicianNotesChange(e, patientImage._id)}
                />
              </label>
        </div>
    )
}

export { SourceImage };