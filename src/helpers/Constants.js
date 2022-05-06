function textFormat(r) {
  return `/${r}/`;
}
export const entities = {
  USER: 'user',
  MEDICO: 'medico',
  PATIENT:'patient',
  PATIENTCODE:'patientcode',
  PIANOTERAPEUTICO:'pianoterapeutico', 
  CAREMANAGER:'caremanager',
  MEDICATION:'medication'
};

export const API = {
  TODOS: textFormat(entities.TODOS),
  USER: textFormat(entities.USER),
  MEDICO: textFormat(entities.MEDICO),
  PATIENT: textFormat(entities.PATIENT),
  PATIENTCODE: textFormat(entities.PATIENTCODE),
  PIANOTERAPEUTICO: textFormat(entities.PIANOTERAPEUTICO),
  CAREMANAGER: textFormat(entities.CAREMANAGER),
  MEDICATION: textFormat(entities.MEDICATION),
};

export const entitiesLabels = {
  WARNING: 'Warning!',
  USER: 'Users',
  ERROR: 'Error!',
  SUCCESS: 'Success!',
}
export const message = {
  //ERROR
  ErrorLogin: 'Username o password errati ',
  ErrorUnauthorized: 'Utente non autorizzato',
  ErrorServer: 'Errore interno al programma ',
  ErrorRequire: 'Inserire tutti i campi richiesti ',
  ///SUCCESS
  SuccessInsert: 'Inserito correttamente ',
  SuccessUpdate: 'Aggiornato correttamente',
  SuccessSend: 'Inviato Correttamente ',
  ErroSend: 'Non Inviato Correttamente ',
  ///OBJECT
  USER: 'user',
  MEDICO: 'Medico ',
  TERAPIA: 'Terapia ',
  CODICE: 'Codice ',
  PATIENT: 'Paziente ',
  CAREMANAGER: 'CareManager ',
  PIANOTERAPEUTICO:'Piano Terapeutico '
}
export const notificationType = {
  PRIMARY: 'primary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
}

export const role = {
  CAREMANAGER: 3,
  PATIENT: 2,
  DOCTOR:1
}