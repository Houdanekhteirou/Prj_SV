import React, { useState } from 'react'
import { MenuItem, Select, FormControl, InputLabel, ListSubheader, Collapse, IconButton, Box } from '@mui/material'

const data = [
  {
    label: 'Femme enceinte complètement vaccinée contre le tétanos et la diphtérie (TD)',
    value: '36',
    type: 'group',
    children: [
      {
        label: 'Femme enceinte complètement vaccinée contre le tétanos et la diphtérie (TD)',
        value: '33',
        type: 'element'
      }
    ]
  },
  {
    label: 'Enfant 6-59 mois PEC malnutrition aigüe sévère (CRENAS+CRENI)',
    value: '40',
    type: 'group',
    children: [
      {
        label: 'Enfant 6-59 mois PEC malnutrition aigüe sévère sans complications médicales (CRENAS)',
        value: '17',
        type: 'element'
      },
      {
        label: 'Prise en charge de la malnutrition aigüe sévère avec complications médicales (CRENI)',
        value: '124',
        type: 'element'
      }
    ]
  },
  {
    label: 'Cas TB (TPM+) traités et guéris',
    value: '42',
    type: 'group',
    children: [
      {
        label: 'Dépistage des cas TB positifs (TPM+) par mois',
        value: '52',
        type: 'element'
      },
      {
        label: 'Cas TB (TPM+) traités et guéris',
        value: '43',
        type: 'element'
      }
    ]
  },
  {
    label: 'Consultation post natale (2 consultations)',
    value: '34',
    type: 'group',
    children: [
      {
        label: 'Consultation post natale (2 consultations)',
        value: '45',
        type: 'element'
      }
    ]
  },
  {
    label: 'Total Consultation PF (ancienne et nouvelle)',
    value: '39',
    type: 'group',
    children: [
      {
        label: 'Consultation PF (ancienne et nouvelle) - contraceptif oral ou d’injectable',
        value: '19',
        type: 'element'
      },
      {
        label: 'Consultation PF (ancienne et nouvelle) - DIU et implant',
        value: '20',
        type: 'element'
      }
    ]
  },
  {
    label: 'Femmes enceinte protégées contre le Paludisme au cours de la grossesse (Traitement Préventif Intermittent)',
    value: '37',
    type: 'group',
    children: [
      {
        label:
          'Femmes enceinte protégées contre le Paludisme au cours de la grossesse (Traitement Préventif Intermittent)',
        value: '10',
        type: 'element'
      }
    ]
  },
  {
    label: 'ARCHIVAGE DES DOCUMENTS',
    value: '31',
    type: 'group',
    children: []
  },
  {
    label: 'COMPILATION ET TRANSMISSION DES FACTURES DES STRUCTURES',
    value: '30',
    type: 'group',
    children: []
  },
  {
    label: 'VÉRIFICATION QUANTITATIVE',
    value: '1',
    type: 'group',
    children: []
  },
  {
    label: 'SAISIE DES RÉSULTATS',
    value: '2',
    type: 'group',
    children: []
  },
  {
    label: 'ORGANISATION DE L’ÉVALUATION DE LA PERFORMANCE DES STRUCTURES DU NIVEAU CENTRAL',
    value: '29',
    type: 'group',
    children: []
  },
  {
    label: 'ORGANISATION VÉRIFICATION QUALITATIVE DES CHR',
    value: '28',
    type: 'group',
    children: []
  },
  {
    label: 'Evaluation de la performance des DRAS, des Circonscriptions Sanitaires, des CR et des ERV',
    value: '27',
    type: 'group',
    children: []
  },
  {
    label: 'PLANIFICATION - COORDINATION',
    value: '26',
    type: 'group',
    children: []
  },
  {
    label: 'DÉLAI ET COMPLÉTUDE DE VIREMENTS/PAIEMENTS DES SUBSIDES',
    value: '24',
    type: 'group',
    children: []
  },
  {
    label: 'INDICATEURS DE PERFORMANCE DE LA REGION',
    value: '22',
    type: 'group',
    children: []
  },
  {
    label: 'PLANIFICATION SUIVI ET EVALUATION',
    value: '21',
    type: 'group',
    children: []
  },
  {
    label: 'VÉRIFICATION DE LA QUALITÉ',
    value: '19',
    type: 'group',
    children: []
  },
  {
    label: 'SUPERVISIONS',
    value: '17',
    type: 'group',
    children: []
  },
  {
    label: 'VACCINATION',
    value: '14',
    type: 'group',
    children: []
  },
  {
    label: 'MEDICAMENTS TRACEURS ',
    value: '13',
    type: 'group',
    children: []
  },
  {
    label: 'GESTION DES MEDICAMENTS',
    value: '12',
    type: 'group',
    children: []
  },
  {
    label: 'HYGIENE & ENVIRONNEMENT DE TRAVAIL',
    value: '11',
    type: 'group',
    children: []
  },
  {
    label: 'PLANIFICATION SUIVI ET ÉVALUATION',
    value: '9',
    type: 'group',
    children: []
  },
  {
    label: 'SUPERVISIONS',
    value: '6',
    type: 'group',
    children: []
  },
  {
    label: 'CONTRACTUALISATION',
    value: '3',
    type: 'group',
    children: []
  },
  {
    label: 'VÉRIFICATION COMMUNAUTAIRE',
    value: '4',
    type: 'group',
    children: []
  },
  {
    label: 'FEEDBACK  SUR L’EFFECTIVITÉ DES PAIEMENTS DES STRUCTURES CONTRACTUALISÉES',
    value: '25',
    type: 'group',
    children: []
  },
  {
    label: 'FINANCEMENT DES ACTIVITÉS DE MISE EN œUVRE DU FBR',
    value: '23',
    type: 'group',
    children: []
  },
  {
    label: 'INDICATEURS DE PERFORMANCE DU DISTRICT',
    value: '20',
    type: 'group',
    children: []
  },
  {
    label: 'CONTRÔLES',
    value: '18',
    type: 'group',
    children: []
  },
  {
    label: 'GESTION DE L’INFORMATION SANITAIRE',
    value: '16',
    type: 'group',
    children: []
  },
  {
    label: 'INTRANTS PROGRAMMES SPÉCIFIQUES (SR, PALUDISME, NUTRITION, TUBERCULOSE, VIH)',
    value: '15',
    type: 'group',
    children: []
  },
  {
    label: 'GESTION FINANCIERE',
    value: '10',
    type: 'group',
    children: []
  },
  {
    label: 'INDICATEURS GÉNÉRAUX',
    value: '8',
    type: 'group',
    children: []
  },
  {
    label: 'COORDINATION',
    value: '7',
    type: 'group',
    children: []
  },
  {
    label: 'COACHING DES ÉQUIPES DES FS',
    value: '5',
    type: 'group',
    children: []
  },
  {
    label: 'Accouchements assistés',
    value: '45',
    type: 'group',
    children: [
      {
        label: 'Césariennes (indigent et non indigent)',
        value: '38',
        type: 'group',
        children: [
          {
            label: 'Césariennes (patient non indigent)',
            value: '5',
            type: 'element'
          },
          {
            label: 'Césariennes - indigent',
            value: '4',
            type: 'element'
          }
        ]
      },
      {
        label: 'Accouchements assistés (hors césariennes)',
        value: '33',
        type: 'group',
        children: [
          {
            label: 'Accouchement dystocique patient non indigent',
            value: '47',
            type: 'element'
          },
          {
            label: 'Accouchement dystocique indigent',
            value: '29',
            type: 'element'
          },
          {
            label: 'Accouchement eutocique assisté par un personnel qualifié indigent',
            value: '34',
            type: 'element'
          },
          {
            label: 'Accouchement eutocique assisté par un personnel qualifié non indigent',
            value: '41',
            type: 'element'
          }
        ]
      }
    ]
  },
  {
    label: 'Consultations externes',
    value: '46',
    type: 'group',
    children: [
      {
        label: 'Nouvelles consultations curatives 5 ans et plus',
        value: '32',
        type: 'group',
        children: [
          {
            label: 'Nouvelle consultation curative chez les 5 ans et plus non indigent',
            value: '28',
            type: 'element'
          },
          {
            label: 'Nouvelle consultation curative chez les 5 ans et plus indigent',
            value: '37',
            type: 'element'
          },
          {
            label: 'Nouvelle consultation curative par un Médecin chez les 5 ans et plus (patient non indigent)',
            value: '3',
            type: 'element'
          },
          {
            label: 'Nouvelle consultation curative par un Médecin chez les 5 ans et plus indigent',
            value: '24',
            type: 'element'
          }
        ]
      },
      {
        label: 'Nouvelles consultations curatives moins de 5 ans  ',
        value: '41',
        type: 'group',
        children: [
          {
            label: 'Nouvelle consultation curative par un Médecin chez les moins de 5 ans indigent',
            value: '12',
            type: 'element'
          },
          {
            label: 'Nouvelle consultation curative chez les moins de 5 ans indigent',
            value: '340',
            type: 'element'
          },
          {
            label: 'Nouvelle consultation curative par un Médecin chez les moins de 5 ans (patient non indigent)',
            value: '13',
            type: 'element'
          }
        ]
      }
    ]
  },
  {
    label: 'Disponibilité du personnel dans la Zone PBF',
    value: '409',
    type: 'element'
  },
  {
    label: 'Gestion des plaintes entre la population et la FOSA',
    value: '414',
    type: 'element'
  },
  {
    label: 'Petite chirurgie y inclut circoncision indigent',
    value: '341',
    type: 'element'
  },
  {
    label: 'Cas référé par relais communautaire et arrivé (plafond 5% de la population)',
    value: '378',
    type: 'element'
  },
  {
    label: 'Evaluation trimestrielle du CT-FBR est faite dans les délais réglementaires',
    value: '396',
    type: 'element'
  },
  {
    label: 'Elaboration du Plan d’action annuel de la circonscription sanitaire des séquences trimestrielles',
    value: '193',
    type: 'element'
  },
  {
    label:
      'Archivage et classement de toutes les demandes de paiement et leurs annexes et les avis du virement dans les comptes des FOSA',
    value: '172',
    type: 'element'
  },
  {
    label: 'Cas d’infection sexuellement transmissible (IST) pris en charge selon le protocole national',
    value: '44',
    type: 'element'
  },
  {
    label: 'Salles d’hospitalisation',
    value: '190',
    type: 'element'
  },
  {
    label: 'Journées d’observation pour les moins de 5 ans indigent',
    value: '11',
    type: 'element'
  },
  {
    label: 'Journées d’hospitalisation indigent',
    value: '16',
    type: 'element'
  },
  {
    label: 'Nv nés de mère VIH+ traitement prophylactique ARV',
    value: '30',
    type: 'element'
  },
  {
    label: 'Femme prise en charge avortement - curetage',
    value: '25',
    type: 'element'
  },
  {
    label: 'Référence reçu et contre référence renvoyé non indigent',
    value: '21',
    type: 'element'
  },
  {
    label: 'Référence reçu et contre référence renvoyé Indigent',
    value: '38',
    type: 'element'
  },
  {
    label: 'Référence et patient arrivé à l’Hôpital Régional indigent',
    value: '36',
    type: 'element'
  },
  {
    label: 'Suivi Evaluation et Système d’Information Sanitaire',
    value: '82',
    type: 'element'
  },
  {
    label: 'Femme enceinte VIH+, traitement prophylactique ARV',
    value: '42',
    type: 'element'
  },
  {
    label: 'Activités générales',
    value: '54',
    type: 'element'
  },
  {
    label: 'Consultation externe et Urgences',
    value: '72',
    type: 'element'
  },
  {
    label: 'Consultation Prénatale',
    value: '67',
    type: 'element'
  },
  {
    label: 'Hygiène, Environnement et Stérilisation',
    value: '55',
    type: 'element'
  },
  {
    label: 'Maternité',
    value: '95',
    type: 'element'
  },
  {
    label: 'Planification Familiale',
    value: '81',
    type: 'element'
  },
  {
    label: 'Prise en charge des pathologies chroniques',
    value: '73',
    type: 'element'
  },
  {
    label: 'Chirurgie majeure (patient non indigent)',
    value: '125',
    type: 'element'
  },
  {
    label: 'Laboratoire',
    value: '229',
    type: 'element'
  },
  {
    label: 'Gestion de l’équipe cadre de la CSM',
    value: '225',
    type: 'element'
  },
  {
    label: 'Bloc opératoire',
    value: '223',
    type: 'element'
  },
  {
    label: 'Petite Chirurgie et Pansement',
    value: '211',
    type: 'element'
  },
  {
    label: 'Réalisation de l’évaluation trimestrielle de la qualité technique des FOSA PMA',
    value: '194',
    type: 'element'
  },
  {
    label: 'Encadrement des FOSA PMA dans l’élaboration de leurs plans d’action annuel et semestriel',
    value: '191',
    type: 'element'
  },
  {
    label: 'Gestion financière et des biens',
    value: '161',
    type: 'element'
  },
  {
    label: 'Vérification mensuelle des prestations quantitatives des formations Sanitaires',
    value: '153',
    type: 'element'
  },
  {
    label: 'Chirurgie majeure indigent',
    value: '130',
    type: 'element'
  },
  {
    label: 'Indicateurs de performance du district',
    value: '122',
    type: 'element'
  },
  {
    label: 'MEDICAMENTS TRACEURS ',
    value: '120',
    type: 'element'
  },
  {
    label: 'Gestion des Médicaments',
    value: '119',
    type: 'element'
  },
  {
    label: 'Coordination',
    value: '111',
    type: 'element'
  },
  {
    label: 'Vérification communautaire',
    value: '108',
    type: 'element'
  },
  {
    label: 'Saisie des résultats',
    value: '106',
    type: 'element'
  },
  {
    label: 'Vérification quantitative',
    value: '105',
    type: 'element'
  },
  {
    label: 'Tous les membres ont participé à la réunion (ou soit représentés en cas d’empêchement).',
    value: '232',
    type: 'element'
  },
  {
    label: 'Tenue régulière des réunions du CNC (Réunion par trimestre)',
    value: '252',
    type: 'element'
  },
  {
    label: 'Supervision et gestion financière',
    value: '315',
    type: 'element'
  },
  {
    label: 'Consultation Externe et Mise en Observation',
    value: '97',
    type: 'element'
  },
  {
    label: 'Contribuer à la mise en oeuvre des réformes hospitalières liées à la mise en oeuvre du PBF',
    value: '312',
    type: 'element'
  },
  {
    label:
      'Elaboration du Plan d’action annuel de la Direction Régionale à l’Action Sanitaire avec des séquences trimestrielles',
    value: '267',
    type: 'element'
  },
  {
    label:
      'Formulation des recommandations pertinentes lors de la réunion et faire le bilan de la mise en oeuvre des celles formulées lors de la réunion précédente',
    value: '328',
    type: 'element'
  },
  {
    label: 'Gestion du malade',
    value: '258',
    type: 'element'
  },
  {
    label:
      'Paiement des formations sanitaires et des entités impliquées dans la mise en oeuvre du PBF dans les délais requis',
    value: '285',
    type: 'element'
  },
  {
    label:
      'Fiches d’enquête renseignées convenablement sont remises à l’ERV dans les délais réglementaire (promptitude)',
    value: '412',
    type: 'element'
  },
  {
    label: 'Qualité de remplissage',
    value: '413',
    type: 'element'
  },
  {
    label: 'Elaboration et validation du rapport d’évaluation du SG/MS',
    value: '401',
    type: 'element'
  },
  {
    label: 'Fiches d’enquête renseignées correctement (complétude)',
    value: '411',
    type: 'element'
  },
  {
    label: 'Planification Opérationnelle',
    value: '410',
    type: 'element'
  },
  {
    label: 'Analyse, validation et transmission des factures et procès-verbaux subsides PBF',
    value: '354',
    type: 'element'
  },
  {
    label: 'Transmission des rapports d’évaluation dans le délai requis',
    value: '405',
    type: 'element'
  },
  {
    label: 'Elaboration et validation du rapport d’évaluation de la DMH',
    value: '404',
    type: 'element'
  },
  {
    label: 'Elaboration et validation du rapport d’évaluation du CT-FBR',
    value: '402',
    type: 'element'
  },
  {
    label: 'Elaboration et validation du rapport d’évaluation de la DAF',
    value: '398',
    type: 'element'
  },
  {
    label: 'Elaboration et validation du rapport d’évaluation UT-FBR',
    value: '397',
    type: 'element'
  },
  {
    label: 'Evaluation trimestrielle de la DMH est faite dans les délais réglementaires',
    value: '394',
    type: 'element'
  },
  {
    label: 'Evaluation trimestrielle de l’UT-FBR.',
    value: '391',
    type: 'element'
  },
  {
    label: 'satisfaction des utilisateurs',
    value: '388',
    type: 'element'
  },
  {
    label: 'Planification des activités de mise en oeuvre du PBF',
    value: '359',
    type: 'element'
  },
  {
    label: 'Visite à domicile selon protocole',
    value: '376',
    type: 'element'
  },
  {
    label: 'Supervision formative trimestrielle de toutes les FOSA PMA',
    value: '361',
    type: 'element'
  },
  {
    label: 'Evaluation de la performance trimestrielle des DRAS, des Circonscriptions Sanitaires, des CR et des ERV',
    value: '355',
    type: 'element'
  },
  {
    label: 'Evaluation trimestrielle du SG/MS est faite dans les délais réglementaires',
    value: '395',
    type: 'element'
  },
  {
    label: 'Evaluation trimestrielle de la DAF est faite dans les délais réglementaires',
    value: '392',
    type: 'element'
  },
  {
    label: 'vérification de la prestation effectuée',
    value: '387',
    type: 'element'
  },
  {
    label: 'vérification de l’existence des utilisateurs enregistrés',
    value: '384',
    type: 'element'
  },
  {
    label: 'Lutte contre le VIH/SIDA',
    value: '369',
    type: 'element'
  },
  {
    label: 'Validation trimestrielle et transmission des factures régionales',
    value: '368',
    type: 'element'
  },
  {
    label:
      'Signature des contrats de performance avec les formations sanitaires et avec les associations à base communautaires',
    value: '364',
    type: 'element'
  },
  {
    label: "Journées d'hospitalisation- (patient non indigent)",
    value: '9',
    type: 'element'
  },
  {
    label: 'Cas d’abandon récupérés (plafond 2% pop)',
    value: '377',
    type: 'element'
  },
  {
    label: 'Patient vivant VIH nouvellement mis sous ARV',
    value: '35',
    type: 'element'
  },
  {
    label: 'Petite chirurgie - y inclut circoncision patient non indigent',
    value: '32',
    type: 'element'
  },
  {
    label: 'Journées d’observation pour les moins de 5 ans patient non indigent',
    value: '26',
    type: 'element'
  },
  {
    label: 'Consultations prénatales (4 visites au cours de la grossesse)',
    value: '46',
    type: 'element'
  },
  {
    label: 'Journées d’observation pour les plus de 5 ans non indigent',
    value: '389',
    type: 'element'
  },
  {
    label: 'Journées d’observation pour les plus de 5 ans indigent',
    value: '27',
    type: 'element'
  },
  {
    label: 'Nouvelle consultation curative chez les moins de 5 ans non indigent',
    value: '22',
    type: 'element'
  },
  {
    label: 'Aspiration Manuel Intra Utérine (AMIU) post-avortement ou avortement thérapeutique',
    value: '18',
    type: 'element'
  },
  {
    label: 'Première Consultation prénatale précoce (au 1er trimestre de la grossesse)',
    value: '50',
    type: 'element'
  },
  {
    label: 'Patient vivant VIH sous ARV suivie pendant 3 mois',
    value: '48',
    type: 'element'
  },
  {
    label: 'Dépistage volontaire du VIH/SIDA + Hépatite B (y compris femmes enceintes)',
    value: '49',
    type: 'element'
  },
  {
    label: 'Référence et patient arrivé à l’Hôpital Régional patient non indigent)',
    value: '51',
    type: 'element'
  },
  {
    label: 'Référence CS arrivé hôpital et contre-référence renvoyé (patient non indigent)',
    value: '127',
    type: 'element'
  },
  {
    label: 'Référence CS arrivé hôpital et contre-référence renvoyé patient indigent',
    value: '6',
    type: 'element'
  },
  {
    label: 'Les réunions mensuelles du CT-FBR sont régulièrement tenues',
    value: '218',
    type: 'element'
  },
  {
    label: 'Complétude et Promptitude des données du système d’information sanitaire',
    value: '195',
    type: 'element'
  },
  {
    label: 'Analyse de l’évolution des indicateurs du système d’information sanitaire',
    value: '131',
    type: 'element'
  },
  {
    label: 'Intrants programmes spécifiques (SR, paludisme, Nutrition, Tuberculose, VIH)',
    value: '121',
    type: 'element'
  },
  {
    label: 'Gestion de l’équipe dirigeante de la DRAS',
    value: '116',
    type: 'element'
  },
  {
    label: 'Saisie des données quantitatives et qualitatives dans le portail PBF',
    value: '109',
    type: 'element'
  },
  {
    label: 'Vaccination et suivi des enfants de moins de 5 ans',
    value: '66',
    type: 'element'
  },
  {
    label:
      'Transmission dans les délais des factures et procès-verbaux de validation relatifs aux prestations quantité et qualité pour FOSA et ABC',
    value: '271',
    type: 'element'
  },
  {
    label: 'Supervision formative trimestrielle des Circonscriptions Sanitaires',
    value: '250',
    type: 'element'
  },
  {
    label: 'Signature des contrats de performance avec les entités conformément au MPT',
    value: '348',
    type: 'element'
  },
  {
    label:
      'Analyse trimestrielle du plan de mise en oeuvre du FBR par l’UT-FBR et l’utilisation du budget mis à la disposition de l’UT-FBR',
    value: '337',
    type: 'element'
  },
  {
    label: 'Contribuer à la mise en oeuvre des réformes/mesures soumises par le CT-FBR liées à la pureté du PBF',
    value: '353',
    type: 'element'
  },
  {
    label: 'Evaluation trimestrielle de la qualité Technique des structures hospitalières régionales est faite',
    value: '310',
    type: 'element'
  },
  {
    label: 'Gestion Financière',
    value: '59',
    type: 'element'
  },
  {
    label: 'Imagerie Médicale',
    value: '79',
    type: 'element'
  },
  {
    label:
      'Le CT-FBR participe à la mise en oeuvre des réformes nécessaires pour le bon fonctionnement du FBR en Mauritanie',
    value: '339',
    type: 'element'
  },
  {
    label:
      'Mise en place et fonctionnalité des instances de pilotage, de coordination et du suivi pour le bon fonctionnement du FBR',
    value: '347',
    type: 'element'
  },
  {
    label: 'Prise en charge de la Tuberculose',
    value: '80',
    type: 'element'
  },
  {
    label: 'Réalisation de l’évaluation trimestrielle de la qualité technique des FOSA PMA',
    value: '259',
    type: 'element'
  }
]

const AppSelect = () => {
  const [selectedValue, setSelectedValue] = useState('')
  const [openGroups, setOpenGroups] = useState({})

  const handleChange = event => {
    setSelectedValue(event.target.value)
  }

  const handleToggleGroup = (value, event) => {
    event.stopPropagation()
    setOpenGroups(prev => ({ ...prev, [value]: !prev[value] }))
  }

  const renderMenuItems = (items, level = 0) => {
    return items.map(item => {
      if (item.type === 'group' && item.children) {
        const isOpen = openGroups[item.value] || false

        return [
          <MenuItem
            key={item.value}
            value={item.value}
            style={{ paddingLeft: level * 16, display: 'flex', alignItems: 'center' }}
            onClick={event => event.stopPropagation()}
          >
            <Box component='span' flexGrow={1} onClick={() => setSelectedValue(item.value)}>
              {item.label}
            </Box>
            <IconButton size='small' onClick={event => handleToggleGroup(item.value, event)}>
              {isOpen ? '-' : '+'}
            </IconButton>
          </MenuItem>,
          // <Collapse key={`${item.value}-collapse`} in={isOpen} timeout='auto' unmountOnExit>
          isOpen && renderMenuItems(item.children, level + 1)
        ]
      }

      return (
        <MenuItem key={item.value} value={item.value} style={{ paddingLeft: level * 16 }} onClick={handleChange}>
          {item.label}
        </MenuItem>
      )
    })
  }

  return (
    <FormControl fullWidth>
      <InputLabel id='custom-select-label'>Select</InputLabel>
      <Select
        labelId='custom-select-label'
        value={selectedValue}
        onChange={handleChange}
        label='Select'
        open={true}
        // multiple={true}
      >
        {renderMenuItems(data)}
      </Select>
    </FormControl>
  )
}

export default AppSelect
