'use client'

import { useEffect } from 'react'

const VILLES_PAR_REGION: Record<string, string[]> = {
  "Niamey": ["Niamey"],
  "Dosso": ["Dosso", "Gaya", "Doutchi", "Loga"],
  "Maradi": ["Maradi", "Tessaoua", "Dakoro", "Mayahi"],
  "Tahoua": ["Tahoua", "Abalak", "Birni-N'Konni", "Madaoua"],
  "Zinder": ["Zinder", "Magaria", "Gouré", "Mirriah"],
  "Agadez": ["Agadez", "Arlit", "Bilma", "Tchirozérine"],
  "Diffa": ["Diffa", "N'Guigmi", "Maïné-Soroa"],
  "Tillabéri": ["Tillabéri", "Tera", "Filingué", "Say", "Kollo"],
}

export default function RegionVilleSync() {
  useEffect(() => {
    const regionSelect = document.getElementById('region') as HTMLSelectElement
    const villeSelect = document.getElementById('ville') as HTMLSelectElement

    if (!regionSelect || !villeSelect) return

    const updateVilleOptions = () => {
      const selectedRegion = regionSelect.value
      const villes = selectedRegion ? VILLES_PAR_REGION[selectedRegion] || [] : []

      // Sauvegarder la valeur actuelle
      const currentVille = villeSelect.value

      // Effacer et reconstruire les options
      villeSelect.innerHTML = '<option value="">Toutes les villes</option>'
      
      villes.forEach(ville => {
        const option = document.createElement('option')
        option.value = ville
        option.textContent = ville
        villeSelect.appendChild(option)
      })

      // Restaurer la sélection si toujours valide
      if (villes.includes(currentVille)) {
        villeSelect.value = currentVille
      } else {
        villeSelect.value = ""
      }

      // Activer/désactiver le champ ville
      villeSelect.disabled = !selectedRegion
    }

    regionSelect.addEventListener('change', updateVilleOptions)
    
    // Initialisation au chargement
    updateVilleOptions()

    return () => {
      regionSelect.removeEventListener('change', updateVilleOptions)
    }
  }, [])

  return null
}

