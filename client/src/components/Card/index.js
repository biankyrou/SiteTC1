import React from "react";
import "./index.css";

const Card = ({ follower, onSchedule }) => {
  return (
    <div className="card-modal">
      <div className="card-header">{follower.name}</div>
      <div className="card-body">
        <p>
          <strong>Gênero:</strong> {follower.gender}
        </p>
        <p>
          <strong>Nível de Devoção:</strong> {follower.nivel}
        </p>
        <p>
          <strong>Email:</strong> {follower.occupation}
        </p>
      </div>
      <div className="card-footer"></div>
    </div>
  );
};

export default Card;
