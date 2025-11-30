import React, { useState, useRef } from 'react';
import { 
  AlertTriangle, 
  ClipboardCheck, 
  FileText, 
  Gauge, 
  Camera, 
  Trash2,
  HardDrive,
  Download,
  Microscope,
  Flame,
  Hammer,
  Settings,
  CheckCircle2,
  XCircle,
  UserCheck,
  FolderCheck
} from 'lucide-react';
import { FormData, INITIAL_STATE, TestType } from './types';
import { Input, Select } from './components/Input';
import { CollapsibleSection } from './components/CollapsibleSection';

export default function App() {
  const [data, setData] = useState<FormData>(INITIAL_STATE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof FormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('photoDataUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSectionReferences = (section: 2 | 3 | 4 | 5, type: TestType): string => {
    switch (type) {
      case TestType.TRACTION_AMBIANT:
        if (section === 2) return "(2101 / 2105)";
        if (section === 3) return "(2102-2103)";
        if (section === 4) return "(2104 / 2106-2107)";
        if (section === 5) return "(2108-2109)";
        break;
      case TestType.TRACTION_HAUTE_TEMP:
        if (section === 2) return "(2201 / 2203-2204)";
        if (section === 3) return "(2202 / 2205)";
        if (section === 4) return "(2207-2209 / 2211-2212)";
        if (section === 5) return "(2213-2214)";
        break;
      case TestType.FLEXION:
        if (section === 2) return "(2301-2302)";
        if (section === 3) return "(2303-2305)";
        if (section === 4) return "(2306-2311)";
        if (section === 5) return "(2312)";
        break;
      case TestType.DURETE:
        if (section === 2) return "(2401-2402)";
        if (section === 3) return "(Prep. 2403)";
        if (section === 4) return "(2403-2404)";
        if (section === 5) return "(2405)";
        break;
    }
    return "";
  };

  const generateCSV = () => {
    const headers = [
      'Type Essai', 'Date', 'Inspecteur', 'CRA', 'Conflit Interet',
      'Labo', 'ISO17025', 'No Accr/Proc Indus', 'Date Validite', 'Proc Etalonnage', 'Doc Suivi', 'Suivi Complet', 'Verif Contrat', 'Operateur', 'Habilite',
      'Machine ID', 'Rapport Etalonnage', 'Logiciel', 
      'Eprouvette', 'Nuance', 
      'AFCEN 18-198', 'AFCEN Param', 'AFCEN Valeurs',
      'Resultat 1', 'Resultat 2', 'Resultat 3',
      'PV Conforme', 'Fichiers Bruts Dispo'
    ];

    const row = [
      data.selectedTestType,
      data.inspectionDate,
      data.inspectorName,
      data.craNumber,
      data.conflictOfInterest ? 'OUI' : 'NON',
      data.labName,
      data.isIso17025 ? 'OUI' : 'NON',
      data.isIso17025 ? data.accreditationNumber : data.industrialProcedureRef,
      data.accreditationDate,
      data.calibrationControlProcedure,
      data.followUpDocRef,
      data.isFollowUpDocComplete ? 'OUI' : 'NON',
      data.docConformityCheck,
      data.operatorName,
      data.isOperatorQualified ? 'OUI' : 'NON',
      data.machineRef,
      data.calibrationReportNumber,
      data.softwareName,
      data.specimenRef,
      data.materialGrade,
      data.isAfcenApplicable ? 'OUI' : 'NON',
      data.afcenParameters,
      data.afcenValues,
      data.rm,
      data.rp02,
      data.aPercent,
      data.pvContentCompliant ? 'OUI' : 'NON',
      data.rawFilesProvided ? 'OUI' : 'NON'
    ].map(v => `"${v || ''}"`).join(';');

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(';') + "\n" + row;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `B572_${data.selectedTestType}_${data.inspectionDate}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-edf-orange rounded-full flex items-center justify-center text-white font-bold">E</div>
               <h1 className="text-lg font-bold text-edf-blue">Guide B572</h1>
            </div>
            <p className="text-xs font-semibold text-gray-400">Rév. 05</p>
          </div>
          
          <div className="mt-2">
            <select
              value={data.selectedTestType}
              onChange={(e) => setData({...INITIAL_STATE, selectedTestType: e.target.value as TestType})}
              className="w-full bg-edf-blue text-white font-bold py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edf-blue appearance-none text-base"
              style={{ backgroundImage: 'none' }}
            >
              <option value={TestType.TRACTION_AMBIANT}>TRACTION - AMBIANT (20°C)</option>
              <option value={TestType.TRACTION_HAUTE_TEMP}>TRACTION - HAUTE TEMPÉRATURE</option>
              <option value={TestType.FLEXION}>FLEXION PAR CHOC (MOUTON)</option>
              <option value={TestType.DURETE}>ESSAI DE DURETÉ</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        {/* Section 1: Admin */}
        <CollapsibleSection title="1. Vérifications Préliminaires (001 / 1001-1003)" icon={ClipboardCheck} defaultOpen={true}>
          <div className={`border rounded-lg p-4 mb-6 transition-colors ${data.conflictOfInterest ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="conflict" 
                        className="w-6 h-6 text-red-600 rounded focus:ring-red-500"
                        checked={data.conflictOfInterest}
                        onChange={(e) => updateField('conflictOfInterest', e.target.checked)}
                    />
                    <label htmlFor="conflict" className="text-sm font-bold text-red-800">
                        Point 001 : Risque de conflit d'intérêt ?
                    </label>
                </div>
              </div>
              
              {!data.conflictOfInterest ? (
                <p className="text-xs text-gray-500 pl-9">
                    S'assurer qu'il n'existe aucun risque (parenté, amitié, subordination).
                </p>
              ) : (
                <div className="mt-3 pl-2 border-l-4 border-red-500 ml-1">
                   <div className="flex items-start gap-2 text-red-700">
                     <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                     <div className="flex flex-col">
                       <span className="font-bold uppercase text-sm">Action Requise</span>
                       <span className="font-semibold">Informer hiérarchie.</span>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* RESPONSIVE GRID ICI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Date" type="date" value={data.inspectionDate} onChange={(e) => updateField('inspectionDate', e.target.value)} />
            <Input label="Inspecteur" value={data.inspectorName} onChange={(e) => updateField('inspectorName', e.target.value)} />
            <Input label="N° Affaire / CRA" className="md:col-span-2" value={data.craNumber} onChange={(e) => updateField('craNumber', e.target.value)} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-edf-blue uppercase mb-4 flex items-center gap-2">
              <FileText size={16}/> Documents & Habilitation
            </h3>
            
            <Input label="Laboratoire" value={data.labName} onChange={(e) => updateField('labName', e.target.value)} />

            <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                 <div 
                   className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${data.isIso17025 ? 'bg-edf-blue' : 'bg-gray-300'}`}
                   onClick={() => updateField('isIso17025', !data.isIso17025)}
                 >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${data.isIso17025 ? 'translate-x-6' : ''}`} />
                 </div>
                 <span className="font-bold text-sm text-gray-700">Le Laboratoire est-il ISO 17025 ?</span>
              </div>

              {data.isIso17025 ? (
                /* RESPONSIVE GRID ICI */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                  <Input 
                    label="N° Accréditation" 
                    value={data.accreditationNumber} 
                    onChange={(e) => updateField('accreditationNumber', e.target.value)} 
                    placeholder="Ex: 1-1234"
                  />
                  <Input 
                    label="Date Validité Accr." 
                    type="date" 
                    value={data.accreditationDate} 
                    onChange={(e) => updateField('accreditationDate', e.target.value)} 
                  />
                </div>
              ) : (
                <div className="animate-in fade-in">
                  <Input 
                    label="Réf. Procédure Industrielle" 
                    value={data.industrialProcedureRef} 
                    onChange={(e) => updateField('industrialProcedureRef', e.target.value)}
                    helperText="Si non accrédité, recenser les procédures."
                  />
                </div>
              )}
            </div>

            <Input 
              label="Procédure de contrôle et d'étalonnage"
              value={data.calibrationControlProcedure}
              onChange={(e) => updateField('calibrationControlProcedure', e.target.value)}
              guidePoint="Point 1001"
              guideText="Vérifier l'établissement d'une procédure de contrôle."
            />

            {/* RESPONSIVE GRID ICI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start mb-4">
              <Input 
                label="Réf. Doc de Suivi" 
                className="md:col-span-2 mb-0"
                value={data.followUpDocRef} 
                onChange={(e) => updateField('followUpDocRef', e.target.value)}
                guidePoint="Point 1001"
                guideText="Fiche suiveuse ou gamme."
              />
              <div 
                className={`flex flex-col items-center justify-center p-2 rounded-lg border h-[72px] cursor-pointer transition-colors mt-4 md:mt-[22px] ${data.isFollowUpDocComplete ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                onClick={() => updateField('isFollowUpDocComplete', !data.isFollowUpDocComplete)}
              >
                 {data.isFollowUpDocComplete ? <CheckCircle2 size={24}/> : <XCircle size={24}/>}
                 <span className="text-[10px] font-bold mt-1 text-center leading-tight">Bien complété?</span>
              </div>
            </div>

            <Input 
              label="Vérification Conformité Documents / Contrats"
              placeholder="Spécifier les vérifications faites..."
              value={data.docConformityCheck}
              onChange={(e) => updateField('docConformityCheck', e.target.value)}
              guidePoint="Point 1002"
              guideText="Vérifier la conformité des documents."
            />

            <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
               <div className="flex flex-col md:flex-row items-end gap-3">
                 <Input 
                   label="Nom Opérateur" 
                   className="w-full mb-0"
                   value={data.operatorName} 
                   onChange={(e) => updateField('operatorName', e.target.value)} 
                 />
                 <div 
                  className={`w-full md:w-auto flex items-center gap-2 p-3 rounded-lg border h-[52px] cursor-pointer mb-[2px] ${data.isOperatorQualified ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                  onClick={() => updateField('isOperatorQualified', !data.isOperatorQualified)}
                 >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${data.isOperatorQualified ? 'bg-edf-blue border-edf-blue' : 'bg-white border-gray-400'}`}>
                      {data.isOperatorQualified && <UserCheck size={14} className="text-white"/>}
                    </div>
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Formé & Habilité (1003)</span>
                 </div>
               </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 2: Machine */}
        <CollapsibleSection 
          title={`2. Machine & Moyens ${getSectionReferences(2, data.selectedTestType)}`} 
          icon={HardDrive} 
          defaultOpen={true}
        >
          <div className="mb-6">
             <Input 
                label="Numéro identification machine" 
                value={data.machineRef} 
                onChange={(e) => updateField('machineRef', e.target.value)} 
             />
             <Input 
                label="N° Rapport Étalonnage" 
                value={data.calibrationReportNumber} 
                onChange={(e) => updateField('calibrationReportNumber', e.target.value)}
                guidePoint="Point 2101"
                guideText="Vérifier le contenu du rapport d'étalonnage."
             />
             
             {/* RESPONSIVE GRID ICI */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <Input 
                 label="Date Étalonnage" 
                 type="date" 
                 value={data.calibrationDate} 
                 onChange={(e) => updateField('calibrationDate', e.target.value)} 
               />
               <Input 
                 label="Date Vérif. Interne" 
                 type="date" 
                 value={data.internalCheckDate} 
                 onChange={(e) => updateField('internalCheckDate', e.target.value)} 
                 guidePoint={data.selectedTestType === TestType.TRACTION_AMBIANT ? "Point 2101" : undefined}
                 guideText="Dernières vérifications internes."
               />
             </div>

             {(data.selectedTestType !== TestType.FLEXION) && (
              /* RESPONSIVE GRID ICI */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input 
                    label="Logiciel" 
                    value={data.softwareName} 
                    onChange={(e) => updateField('softwareName', e.target.value)} 
                />
                <Input label="Version" value={data.softwareVersion} onChange={(e) => updateField('softwareVersion', e.target.value)} />
              </div>
            )}
          </div>

          {/* SPECIFIC FIELDS */}
          {data.selectedTestType === TestType.TRACTION_AMBIANT && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-edf-blue mb-3">Spécifique Traction Ambiante (2101)</h4>
              {/* RESPONSIVE GRID ICI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Extensomètre" 
                  value={data.extensometerRef} 
                  onChange={(e) => updateField('extensometerRef', e.target.value)} 
                />
                <Input 
                  label="Validité Extenso." 
                  type="date" 
                  value={data.extensometerValidity} 
                  onChange={(e) => updateField('extensometerValidity', e.target.value)} 
                />
                <Input 
                  label="Température Local" 
                  value={data.ambientTemp} 
                  onChange={(e) => updateField('ambientTemp', e.target.value)} 
                />
                <Input 
                  label="Hygrométrie Local" 
                  value={data.ambientHygro} 
                  onChange={(e) => updateField('ambientHygro', e.target.value)} 
                />
              </div>
            </div>
          )}

          {data.selectedTestType === TestType.TRACTION_HAUTE_TEMP && (
             <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
               <h4 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2"><Flame size={16}/> Spécifique Haute Temp</h4>
               <div className="grid grid-cols-1 gap-4">
                 <Input 
                    label="Système mesure temp." 
                    placeholder="Ref thermocouples..." 
                    value={data.tempMeasureSystemRef} 
                    onChange={(e) => updateField('tempMeasureSystemRef', e.target.value)} 
                />
                 <Input 
                    label="Position Thermocouples" 
                    placeholder="Contact éprouvette..." 
                    value={data.thermocouplePosition} 
                    onChange={(e) => updateField('thermocouplePosition', e.target.value)} 
                 />
                 <Input label="Extensomètre HT" value={data.extensometerRef} onChange={(e) => updateField('extensometerRef', e.target.value)} />
               </div>
             </div>
          )}

          {data.selectedTestType === TestType.FLEXION && (
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
               <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Hammer size={16}/> Spécifique Mouton (2301)</h4>
               {/* RESPONSIVE GRID ICI */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    label="Rayon Couteau" 
                    value={data.knifeRadius} 
                    onChange={(e) => updateField('knifeRadius', e.target.value)}
                    options={[{value: '2mm', label: '2 mm'}, {value: '8mm', label: '8 mm'}]}
                  />
                  <Input label="Vérif Enclumes/Supports" value={data.moutonAnvilCheck} onChange={(e) => updateField('moutonAnvilCheck', e.target.value)} />
               </div>
            </div>
          )}

          {data.selectedTestType === TestType.DURETE && (
             <Input label="Type Pénétrateur" value={data.indenterType} onChange={(e) => updateField('indenterType', e.target.value)} />
          )}

        </CollapsibleSection>

        {/* Section 3: Specimen */}
        <CollapsibleSection 
          title={`3. L'Éprouvette ${getSectionReferences(3, data.selectedTestType)}`} 
          icon={Microscope} 
          defaultOpen={true}
        >
          {/* RESPONSIVE GRID ICI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
                label="Référence" 
                value={data.specimenRef} 
                onChange={(e) => updateField('specimenRef', e.target.value)} 
                guidePoint="Point 2102"
                guideText="Vérifier l'identification."
            />
            <Input label="Nuance" value={data.materialGrade} onChange={(e) => updateField('materialGrade', e.target.value)} />
            <Input label="Nombre d'éprouvettes" type="number" value={data.specimenCount} onChange={(e) => updateField('specimenCount', e.target.value)} />
            
            {(data.selectedTestType === TestType.TRACTION_AMBIANT || data.selectedTestType === TestType.TRACTION_HAUTE_TEMP) && (
              <>
                 <Input 
                    label="Appareil Mesure" 
                    placeholder="Pied à coulisse..." 
                    value={data.measuringDeviceRef} 
                    onChange={(e) => updateField('measuringDeviceRef', e.target.value)} 
                 />
                 {/* RESPONSIVE GRID IMBRIQUÉ */}
                 <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-3 rounded">
                    <Input label="Section Théorique" type="number" value={data.theoreticalSection} onChange={(e) => updateField('theoreticalSection', e.target.value)} />
                    <Input 
                        label="Section Réelle" 
                        type="number" 
                        value={data.measuredSection} 
                        onChange={(e) => updateField('measuredSection', e.target.value)} 
                        guidePoint="Point 2102"
                        guideText="Utiliser les dimensions réelles."
                    />
                 </div>
              </>
            )}

            {data.selectedTestType === TestType.FLEXION && (
               <div className="col-span-1 md:col-span-2 space-y-4">
                 <Input 
                    label="Position Entaille" 
                    value={data.notchPosition} 
                    onChange={(e) => updateField('notchPosition', e.target.value)} 
                 />
                 <div className="flex items-center gap-2">
                   <input type="checkbox" checked={data.notchGeometryCheck} onChange={(e) => updateField('notchGeometryCheck', e.target.checked)} className="w-5 h-5"/>
                   <label className="text-sm text-gray-700">Conformité géométrie entaille vérifiée ?</label>
                 </div>
               </div>
            )}
            
            {data.selectedTestType === TestType.DURETE && (
               <Input label="État de surface" className="col-span-1 md:col-span-2" placeholder="Meulage, polissage..." value={data.surfaceCondition} onChange={(e) => updateField('surfaceCondition', e.target.value)} />
            )}
          </div>
        </CollapsibleSection>

        {/* Section 4: Pilotage & Résultats */}
        <CollapsibleSection 
          title={`4. Pilotage & Résultats ${getSectionReferences(4, data.selectedTestType)}`} 
          icon={Gauge} 
          defaultOpen={true}
        >
          <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
                 <div 
                   className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${data.isAfcenApplicable ? 'bg-purple-600' : 'bg-gray-300'}`}
                   onClick={() => updateField('isAfcenApplicable', !data.isAfcenApplicable)}
                 >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${data.isAfcenApplicable ? 'translate-x-6' : ''}`} />
                 </div>
                 <div>
                   <span className="font-bold text-sm text-purple-900">Le Guide AFCEN RM 18-198 est-il applicable ?</span>
                 </div>
            </div>

            {data.isAfcenApplicable && (
               /* RESPONSIVE GRID ICI */
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <Input 
                    label="Paramètres Relevés" 
                    value={data.afcenParameters} 
                    onChange={(e) => updateField('afcenParameters', e.target.value)}
                  />
                  <Input 
                    label="Valeurs Relevées" 
                    value={data.afcenValues} 
                    onChange={(e) => updateField('afcenValues', e.target.value)}
                  />
               </div>
            )}
          </div>
          
          {(data.selectedTestType === TestType.TRACTION_AMBIANT || data.selectedTestType === TestType.TRACTION_HAUTE_TEMP) && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-bold text-gray-600 mb-4 flex items-center gap-2"><Settings size={16}/> Pilotage (2104 / 2207)</h4>
                
                {data.selectedTestType === TestType.TRACTION_HAUTE_TEMP && (
                  <div className="mb-4 bg-orange-100 p-3 rounded text-orange-900 border border-orange-200">
                    {/* RESPONSIVE GRID ICI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="Température Essai (°C)" 
                        type="number" 
                        value={data.targetTemp} 
                        onChange={(e) => updateField('targetTemp', e.target.value)} 
                      />
                      <Input 
                        label="Temps Maintien" 
                        value={data.soakingTime} 
                        onChange={(e) => updateField('soakingTime', e.target.value)} 
                      />
                    </div>
                  </div>
                )}

                {/* RESPONSIVE GRID ICI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Vérifs Amarrage" className="md:col-span-2" value={data.grippingChecks} onChange={(e) => updateField('grippingChecks', e.target.value)} />
                  <Input 
                    label="Mode Pilotage" 
                    className="md:col-span-2" 
                    value={data.pilotMode} 
                    onChange={(e) => updateField('pilotMode', e.target.value)} 
                    guidePoint="Point 2104"
                    guideText="Vérifier conformité valeurs paramétrage."
                  />
                  <Select
                      label="Méthode Norme"
                      value={data.methodStandard}
                      onChange={(e) => updateField('methodStandard', e.target.value)}
                      options={[{ value: '', label: '?' }, { value: 'A', label: 'Méthode A' }, { value: 'B', label: 'Méthode B' }]}
                    />
                  <Input label="Vitesse charge" value={data.loadingSpeed} onChange={(e) => updateField('loadingSpeed', e.target.value)} />
                </div>
              </div>

              {/* RESPONSIVE GRID ICI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Rp 0.2 (MPa)" type="number" value={data.rp02} onChange={(e) => updateField('rp02', e.target.value)} />
                 <Input label="Rm (MPa)" type="number" value={data.rm} onChange={(e) => updateField('rm', e.target.value)} />
                 <Input label="A %" type="number" value={data.aPercent} onChange={(e) => updateField('aPercent', e.target.value)} />
                 <Input label="Z %" type="number" value={data.zPercent} onChange={(e) => updateField('zPercent', e.target.value)} />
                 <Input label="Module E (GPa)" type="number" value={data.youngModulus} onChange={(e) => updateField('youngModulus', e.target.value)} />
              </div>
              
              <div className="space-y-2">
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={data.yieldPointPresent} onChange={(e) => updateField('yieldPointPresent', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                    <span>Présence Palier d'écoulement</span>
                 </label>
                 <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={data.curveProfileConform} onChange={(e) => updateField('curveProfileConform', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                    <span>Profil courbe conforme (Zone élastique)</span>
                 </label>
              </div>
            </div>
          )}

          {data.selectedTestType === TestType.FLEXION && (
             <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-3">Conditions Essai (2307/2308)</h4>
                  {/* RESPONSIVE GRID ICI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Température Essai" type="number" value={data.testTempFlexion} onChange={(e) => updateField('testTempFlexion', e.target.value)} />
                    <Input 
                        label="Temps Transfert" 
                        placeholder="< 5 sec" 
                        value={data.transferTime} 
                        onChange={(e) => updateField('transferTime', e.target.value)} 
                    />
                  </div>
                </div>

                {/* RESPONSIVE GRID ICI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Input label="KV (Joules)" type="number" value={data.energyKV} onChange={(e) => updateField('energyKV', e.target.value)} />
                   <Input label="Exp. Latérale (mm)" type="number" value={data.lateralExpansion} onChange={(e) => updateField('lateralExpansion', e.target.value)} />
                   <Input label="Cristallinité (%)" type="number" value={data.crystallinity} onChange={(e) => updateField('crystallinity', e.target.value)} />
                   <Input label="Méthode Transition" value={data.transitionMethod} onChange={(e) => updateField('transitionMethod', e.target.value)} />
                </div>
                
                <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                   <input type="checkbox" checked={data.brokenSpecimen} onChange={(e) => updateField('brokenSpecimen', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                   <span>Éprouvette NON rompue ?</span>
                </label>
             </div>
          )}

          {data.selectedTestType === TestType.DURETE && (
            <div className="space-y-4">
              {/* RESPONSIVE GRID ICI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Charge Essai" value={data.load} onChange={(e) => updateField('load', e.target.value)} />
                <Input label="Temps Maintien (s)" type="number" value={data.holdTime} onChange={(e) => updateField('holdTime', e.target.value)} />
              </div>
              <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <input type="checkbox" checked={data.filiationCheck} onChange={(e) => updateField('filiationCheck', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                  <div>
                    <span className="font-bold block">Point 2403 : Lignes de filiation</span>
                    <span className="text-sm text-gray-500">Vérifier position et espacement des points de mesure (soudure, ZAT...)</span>
                  </div>
              </label>
            </div>
          )}

        </CollapsibleSection>

        {/* Section 5: PV & Fichiers Bruts */}
        <CollapsibleSection 
          title={`5. PV & Fichiers Bruts ${getSectionReferences(5, data.selectedTestType)}`} 
          icon={FolderCheck} 
          defaultOpen={true}
        >
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 border-b pb-2">Contenu du Procès-Verbal</h4>
            
            {/* RESPONSIVE GRID ICI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={data.pvContentCompliant} onChange={(e) => updateField('pvContentCompliant', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                <span className="text-sm">Infos référentiel contractuel présentes</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={data.traceabilityCompliant} onChange={(e) => updateField('traceabilityCompliant', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                <span className="text-sm">Traçabilité correcte (Renvoi docs)</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={data.reproducibilityCompliant} onChange={(e) => updateField('reproducibilityCompliant', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                <span className="text-sm">Reproductibilité satisfaisante</span>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={data.resultsCoherent} onChange={(e) => updateField('resultsCoherent', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                <span className="text-sm">Cohérence valeurs (Max/Min)</span>
              </label>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
               {(data.selectedTestType === TestType.TRACTION_AMBIANT || data.selectedTestType === TestType.TRACTION_HAUTE_TEMP) && (
                 <Input 
                   label="Vérifications Spécifiques Traction"
                   placeholder="Lissage courbe, vitesse déformation..."
                   value={data.tractionPvDetails}
                   onChange={(e) => updateField('tractionPvDetails', e.target.value)}
                 />
               )}

               {data.selectedTestType === TestType.FLEXION && (
                 <Input 
                   label="Vérifications Spécifiques Flexion"
                   placeholder="Calcul énergie, non rupture..."
                   value={data.flexionPvDetails}
                   onChange={(e) => updateField('flexionPvDetails', e.target.value)}
                 />
               )}

               {data.selectedTestType === TestType.DURETE && (
                 <Input 
                   label="Vérifications Spécifiques Dureté"
                   placeholder="Courbes filiation, points..."
                   value={data.hardnessPvDetails}
                   onChange={(e) => updateField('hardnessPvDetails', e.target.value)}
                 />
               )}
            </div>

            <h4 className="font-bold text-gray-700 border-b pb-2 pt-4">Données Brutes</h4>
            <div className="grid grid-cols-1 gap-3">
               <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                  <input type="checkbox" checked={data.rawFilesKept} onChange={(e) => updateField('rawFilesKept', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                  <div>
                    <span className="text-sm font-bold block">Dispositions conservation fichiers</span>
                    <span className="text-xs text-gray-500">Vérifier que l'industriel conserve les fichiers bruts.</span>
                  </div>
               </label>
               <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg hover:bg-gray-50">
                  <input type="checkbox" checked={data.rawFilesProvided} onChange={(e) => updateField('rawFilesProvided', e.target.checked)} className="w-5 h-5 rounded text-edf-blue"/>
                  <div>
                    <span className="text-sm font-bold block">Données brutes fournies (Contre-analyse)</span>
                    <span className="text-xs text-gray-500">Si possible/requis, demander les fichiers pour analyse EDF.</span>
                  </div>
               </label>
            </div>

          </div>
        </CollapsibleSection>

        {/* Photos */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Camera className="text-edf-blue" />
            Photo Courbe / Machine
          </h2>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            ref={fileInputRef}
            onChange={handlePhotoCapture}
          />

          {!data.photoDataUrl ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Camera size={32} className="mb-2" />
              <span className="text-sm font-medium">Prendre une photo</span>
            </button>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img src={data.photoDataUrl} alt="Evidence" className="w-full h-48 object-cover" />
              <button 
                onClick={() => updateField('photoDataUrl', null)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg z-40">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button 
            onClick={() => {
              if (window.confirm('Voulez-vous vraiment effacer tout le formulaire ?')) {
                setData(INITIAL_STATE);
              }
            }}
            className="px-4 py-3 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50"
          >
             Reset
          </button>
          <button 
            onClick={generateCSV}
            className="flex-1 flex items-center justify-center gap-2 bg-edf-blue text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-900 active:transform active:scale-95 transition-all"
          >
            <Download size={20} />
            EXPORTER CSV
          </button>
        </div>
      </div>
    </div>
  );
}