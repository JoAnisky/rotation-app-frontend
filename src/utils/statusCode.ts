enum STATUS {
  NOT_STARTED = "Non démarrée", // The activity has not started yet
  ROTATING = "Rotation", // The activity is in the rotation phase
  IN_PROGRESS = "En cours", // The activity is currently ongoing
  PAUSED = "Pause", // The activity is temporarily paused
  COMPLETED = "Terminée", // The activity has been completed
}

export default STATUS;
