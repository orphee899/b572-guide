
export enum TestType {
  TRACTION_AMBIANT = 'TRACTION_AMBIANT',
  TRACTION_HAUTE_TEMP = 'TRACTION_HAUTE_TEMP',
  FLEXION = 'FLEXION',
  DURETE = 'DURETE'
}

export interface FormData {
  // Section 1: General & Admin
  conflictOfInterest: boolean;
  inspectorName: string;
  inspectionDate: string;
  craNumber: string;

  // Section 1.2: Documents (1001/1002/1003)
  labName: string;
  isIso17025: boolean; // Nouveau: Switch ISO
  accreditationNumber: string; // Si ISO Oui
  accreditationDate: string;   // Si ISO Oui
  industrialProcedureRef: string; // Si ISO Non
  calibrationControlProcedure: string; // "Procédure de contrôle et d'étalonnage"
  
  followUpDocRef: string;
  isFollowUpDocComplete: boolean; // "Bien complété ?"
  
  docConformityCheck: string; // "Vérifications faites" sur la conformité documents vs contrats
  
  operatorName: string; // "1003 Habilitation"
  isOperatorQualified: boolean; // "Formé et habilité"

  // Section 2: Machine & Tools (Dynamic based on TestType)
  machineRef: string;
  calibrationReportNumber: string; // Nouveau champ demandé
  calibrationDate: string;
  internalCheckDate: string;
  softwareName: string;
  softwareVersion: string;
  
  // Specific: Traction & Dureté
  extensometerRef: string;
  extensometerValidity: string;
  ambientTemp: string;
  ambientHygro: string;
  
  // Specific: Traction Haute Temp (Guide 2203, 2204)
  tempMeasureSystemRef: string; // "Système de mesure de la température"
  thermocouplePosition: string; // "Position et contact"
  
  // Specific: Flexion (Guide 2301, 2302)
  moutonAnvilCheck: string; // "Supports / Enclumes"
  knifeRadius: '2mm' | '8mm'; // "Rayon du couteau"
  
  // Specific: Dureté (Guide 2401)
  indenterType: string; // "Pénétrateur"

  // Section 3: Specimen (Dynamic)
  specimenRef: string;
  materialGrade: string;
  specimenCount: string;
  
  // Specific: Traction (2102, 2202)
  theoreticalSection: string;
  measuredSection: string;
  measuringDeviceRef: string;
  
  // Specific: Flexion (2303, 2305)
  notchPosition: string; // "Position de l'entaille"
  notchGeometryCheck: boolean; // "Conformité géométrie entaille"
  
  // Specific: Dureté (2403)
  surfaceCondition: string; // "État de surface"

  // Section 4: Pilotage & Results
  selectedTestType: TestType;
  
  // AFCEN 18-198 Logic
  isAfcenApplicable: boolean;
  afcenParameters: string; // "Relever les paramètres"
  afcenValues: string;     // "Relever les valeurs"
  
  // Pilotage Traction (2104, 2207, 2208)
  grippingChecks: string; 
  pilotMode: string;
  methodStandard: 'A' | 'B' | '';
  loadingSpeed: string; // "Vitesse de mise en charge"
  
  // Specific: Traction Haute Temp (2209)
  soakingTime: string; // "Temps de maintien"
  targetTemp: string; // "Température essai" (Consigne)

  // Resultats Traction
  yieldPointPresent: boolean;
  rp02: string;
  rm: string;
  aPercent: string;
  zPercent: string;
  youngModulus: string;
  curveProfileConform: boolean;

  // Flexion (2307, 2309)
  testTempFlexion: string; // "Température d'essai" (Fluide)
  transferTime: string; // "Transfert éprouvette" (<5s)
  energyKV: string;
  lateralExpansion: string;
  crystallinity: string;
  transitionMethod: string;
  brokenSpecimen: boolean; // "Eprouvette non rompue"

  // Dureté
  load: string;
  holdTime: string;
  filiationCheck: boolean; // "Lignes de filiation"

  // Section 5: PV & Fichiers Bruts (New)
  pvContentCompliant: boolean; // "Contient les infos appelées par le référentiel"
  traceabilityCompliant: boolean; // "Traçabilité correcte"
  reproducibilityCompliant: boolean; // "Reproductibilité satisfaisante"
  resultsCoherent: boolean; // "Valeurs obtenues sont cohérentes"
  
  // Specific PV checks based on test type
  tractionPvDetails: string; // "Lissage courbe, vitesse déformation..."
  flexionPvDetails: string; // "Calcul énergies..."
  hardnessPvDetails: string; // "Courbes de filiation..."
  
  rawFilesKept: boolean; // "Dispositions pour conservation"
  rawFilesProvided: boolean; // "Fournir les données brutes"

  // Photo
  photoDataUrl: string | null;
}

export const INITIAL_STATE: FormData = {
  conflictOfInterest: false,
  inspectorName: '',
  inspectionDate: new Date().toISOString().split('T')[0],
  craNumber: '',
  
  labName: '',
  isIso17025: true,
  accreditationNumber: '',
  accreditationDate: '',
  industrialProcedureRef: '',
  calibrationControlProcedure: '',
  
  followUpDocRef: '',
  isFollowUpDocComplete: false,
  docConformityCheck: '',
  
  operatorName: '',
  isOperatorQualified: false,

  machineRef: '',
  calibrationReportNumber: '',
  calibrationDate: '',
  internalCheckDate: '',
  softwareName: '',
  softwareVersion: '',
  extensometerRef: '',
  extensometerValidity: '',
  ambientTemp: '',
  ambientHygro: '',
  
  tempMeasureSystemRef: '',
  thermocouplePosition: '',
  
  moutonAnvilCheck: '',
  knifeRadius: '2mm',
  
  indenterType: '',

  specimenRef: '',
  materialGrade: '',
  specimenCount: '',
  theoreticalSection: '',
  measuredSection: '',
  measuringDeviceRef: '',
  notchPosition: '',
  notchGeometryCheck: false,
  surfaceCondition: '',
  
  selectedTestType: TestType.TRACTION_AMBIANT,
  
  isAfcenApplicable: false,
  afcenParameters: '',
  afcenValues: '',
  
  grippingChecks: '',
  pilotMode: '',
  methodStandard: '',
  loadingSpeed: '',
  
  soakingTime: '',
  targetTemp: '',

  yieldPointPresent: false,
  rp02: '',
  rm: '',
  aPercent: '',
  zPercent: '',
  youngModulus: '',
  curveProfileConform: false,
  
  testTempFlexion: '',
  transferTime: '',
  energyKV: '',
  lateralExpansion: '',
  crystallinity: '',
  transitionMethod: '',
  brokenSpecimen: false,

  load: '',
  holdTime: '',
  filiationCheck: false,
  
  pvContentCompliant: false,
  traceabilityCompliant: false,
  reproducibilityCompliant: false,
  resultsCoherent: false,
  tractionPvDetails: '',
  flexionPvDetails: '',
  hardnessPvDetails: '',
  rawFilesKept: false,
  rawFilesProvided: false,

  photoDataUrl: null
};
